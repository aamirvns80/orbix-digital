import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Users,
    Target,
    FileText,
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    Sparkles,
    PlusCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";


export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const stats = [
        {
            title: "Total Leads",
            value: "—",
            change: "+12%",
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            href: "/dashboard/leads",
        },
        {
            title: "Qualified",
            value: "—",
            change: "+8%",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            href: "/dashboard/leads?status=qualified",
        },
        {
            title: "In Proposal",
            value: "—",
            change: "+3",
            icon: FileText,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            href: "/dashboard/leads?status=proposal",
        },
        {
            title: "Won Deals",
            value: "—",
            change: "",
            icon: BarChart3,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            href: "/dashboard/leads?status=won",
        },
    ];

    const quickActions = [
        { label: "View Pipeline", href: "/dashboard/leads", icon: Target },
        { label: "Add Lead", href: "/dashboard/leads", icon: PlusCircle },
        { label: "Contact Form", href: "/contact", icon: FileText },
        { label: "Team", href: "/dashboard", icon: Users },
        { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-background">

            <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
                {/* Welcome */}
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome back, {session.user?.name?.split(" ")[0] || "there"} 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s your pipeline overview.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <Link key={stat.title} href={stat.href}>
                            <div className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/30 group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-2xl font-bold mt-3">{stat.value}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-muted-foreground">{stat.title}</span>
                                    {stat.change && (
                                        <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {quickActions.map((action) => (
                            <Link key={action.label} href={action.href}>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card transition-all hover:shadow-md hover:border-primary/30 cursor-pointer">
                                    <action.icon className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">{action.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Pipeline Summary */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Pipeline</h2>
                        <Link href="/dashboard/leads" className="text-sm text-primary hover:underline">
                            View all →
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"].map((stage, i) => {
                            const colors = [
                                "bg-blue-500",
                                "bg-indigo-500",
                                "bg-amber-500",
                                "bg-orange-500",
                                "bg-emerald-500",
                                "bg-red-500",
                            ];
                            return (
                                <div key={stage} className="text-center">
                                    <div className={`h-1.5 rounded-full ${colors[i]} mb-2`} />
                                    <p className="text-xs font-medium text-muted-foreground">{stage}</p>
                                    <p className="text-lg font-bold mt-0.5">—</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity placeholder */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        Connect a database to see live lead activity here.
                    </div>
                </div>
            </main>
        </div>
    );
}
