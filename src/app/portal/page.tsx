import { Suspense } from "react";
import { api } from "@/lib/trpc/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, CheckCircle2, Clock } from "lucide-react";

async function DashboardContent() {
    const deliverables = await api.deliverables.listByCompany();
    const tickets = await api.tickets.listByCompany();

    const pendingDeliverables = deliverables.filter(d => d.status === "pending_review");
    const activeTickets = tickets.filter(t => t.status !== "resolved" && t.status !== "closed");

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingDeliverables.length}</div>
                        <p className="text-xs text-muted-foreground">Deliverables awaiting review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeTickets.length}</div>
                        <p className="text-xs text-muted-foreground">Open support tickets</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {deliverables.filter(d => d.status === "approved").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Approved deliverables</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Deliverables */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Deliverables</CardTitle>
                        <CardDescription>Latest files and designs shared with your team.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {deliverables.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">No deliverables yet.</div>
                        ) : (
                            <div className="space-y-4">
                                {deliverables.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(item.createdAt).toLocaleDateString()} • <span className="capitalize">{item.status.replace("_", " ")}</span>
                                            </p>
                                        </div>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/portal/deliverables/${item.id}`}>View</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4">
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/portal/deliverables">View All Deliverables <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Active Requests */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/portal/requests/new">Submit New Request</Link>
                        </Button>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="/portal/deliverables">Review Pending Items</Link>
                        </Button>

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-3">Recent Requests</h4>
                            {tickets.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent requests.</p>
                            ) : (
                                <div className="space-y-3">
                                    {tickets.slice(0, 3).map(ticket => (
                                        <div key={ticket.id} className="flex justify-between items-center text-sm">
                                            <span className="truncate max-w-[180px]">{ticket.title}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {ticket.status.replace("_", " ")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function PortalDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Client Portal</h1>
                <p className="text-muted-foreground">Overview of your projects and deliverables.</p>
            </div>

            <Suspense fallback={<div>Loading dashboard...</div>}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}
