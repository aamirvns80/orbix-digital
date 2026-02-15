"use client";

import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const utils = trpc.useUtils();

    const { data: count = 0 } = trpc.notifications.getUnreadCount.useQuery(undefined, {
        refetchInterval: 30000, // Poll every 30s
    });

    const { data: notifications = [] } = trpc.notifications.list.useQuery(undefined, {
        enabled: open,
    });

    const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
        onSuccess: () => {
            utils.notifications.getUnreadCount.invalidate();
            utils.notifications.list.invalidate();
        },
    });

    const markAllReadMutation = trpc.notifications.markAllAsRead.useMutation({
        onSuccess: () => {
            utils.notifications.getUnreadCount.invalidate();
            utils.notifications.list.invalidate();
        },
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {count > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background animate-pulse" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {count > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => markAllReadMutation.mutate()}
                            disabled={markAllReadMutation.isPending}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification: any) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-muted/50 transition-colors flex gap-3 items-start",
                                        !notification.isRead && "bg-muted/30"
                                    )}
                                >
                                    <div className={cn(
                                        "h-2 w-2 mt-2 rounded-full flex-shrink-0",
                                        !notification.isRead ? "bg-blue-500" : "bg-transparent"
                                    )} />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {notification.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground pt-1">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                            onClick={() => markAsReadMutation.mutate({ id: notification.id })}
                                        >
                                            <Check className="h-3 w-3" />
                                            <span className="sr-only">Mark read</span>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
