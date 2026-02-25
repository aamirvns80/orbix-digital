"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/ui/notification-bell";
import { useSession } from "next-auth/react";

export function DashboardHeader() {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="MarketifyDigiAI" width={32} height={32} className="rounded-lg" />
                        <span className="text-lg font-bold tracking-tight">MarketifyDigiAI</span>
                    </Link>
                    <span className="text-muted-foreground text-sm hidden sm:inline">
                        / Dashboard
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <ThemeToggle />
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-medium">
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-medium hidden sm:inline">
                            {session?.user?.name || session?.user?.email}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
