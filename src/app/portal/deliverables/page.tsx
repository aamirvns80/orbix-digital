import { Suspense } from "react";
import { api } from "@/lib/trpc/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ExternalLink } from "lucide-react";

async function DeliverablesList() {
    const deliverables = await api.deliverables.listByCompany();

    if (deliverables.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
                <h3 className="text-lg font-semibold">No deliverables yet</h3>
                <p className="text-muted-foreground">You'll see project files here once our team shares them.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((item) => (
                <Card key={item.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant={
                                item.status === "approved" ? "default" :
                                    item.status === "changes_requested" ? "destructive" :
                                        item.status === "pending_review" ? "secondary" : "outline"
                            } className="capitalize">
                                {item.status.replace("_", " ")}
                            </Badge>
                            {item.dueDate && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-0 flex gap-2">
                        <Button asChild className="w-full" variant="outline">
                            <Link href={`/portal/deliverables/${item.id}`}>View Details</Link>
                        </Button>
                        {item.docLink && (
                            <Button asChild size="icon" variant="ghost">
                                <a href={item.docLink} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function DeliverablesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Deliverables</h1>
                <p className="text-muted-foreground">Review and approve project files.</p>
            </div>
            <Suspense fallback={<div>Loading deliverables...</div>}>
                <DeliverablesList />
            </Suspense>
        </div>
    );
}
