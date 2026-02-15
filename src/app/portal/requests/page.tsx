import { Suspense } from "react";
import { api } from "@/lib/trpc/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Clock } from "lucide-react";

async function RequestsList() {
    const tickets = await api.tickets.listByCompany();

    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
                <h3 className="text-lg font-semibold">No requests yet</h3>
                <p className="text-muted-foreground mb-4">Need help or have a new project idea?</p>
                <Button asChild>
                    <Link href="/portal/requests/new">Submit New Request</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tickets.map((ticket) => (
                <div key={ticket.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex gap-4 items-start">
                        <div className={`p-2 rounded-full mt-1 ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                            ticket.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                            <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{ticket.title}</h3>
                                <Badge variant={
                                    ticket.status === 'resolved' ? 'default' :
                                        ticket.status === 'in_progress' ? 'secondary' :
                                            'outline'
                                } className="text-xs">
                                    {ticket.status.replace("_", " ")}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                Created {new Date(ticket.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function RequestsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
                    <p className="text-muted-foreground">Track support tickets and project requests.</p>
                </div>
                <Button asChild>
                    <Link href="/portal/requests/new">
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<div>Loading requests...</div>}>
                <RequestsList />
            </Suspense>
        </div>
    );
}
