"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, MessageSquare, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/ui/notification-bell";
import { signOut } from "next-auth/react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/portal",
        icon: LayoutDashboard,
    },
    {
        title: "Deliverables",
        href: "/portal/deliverables",
        icon: FileText,
    },
    {
        title: "Requests",
        href: "/portal/requests",
        icon: MessageSquare,
    },
    {
        title: "Settings",
        href: "/portal/settings",
        icon: Settings,
    },
];

export function PortalSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full border-r bg-background w-64 md:w-72 lg:w-80 fixed left-0 top-0 bottom-0 z-40">
            <div className="p-6 border-b flex items-center justify-between">
                <Link href="/portal" className="font-bold text-xl">
                    OrbixDigital <span className="text-primary text-sm font-normal ml-1">Portal</span>
                </Link>
                <div className="md:hidden">
                    {/* Mobile toggle would go here */}
                </div>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    );
                })}
            </div>

            <div className="p-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <ThemeToggle />
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
