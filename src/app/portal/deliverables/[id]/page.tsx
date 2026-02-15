import { Suspense } from "react";
import { api } from "@/lib/trpc/api";
import { notFound } from "next/navigation";
import { DeliverableActions } from "@/components/portal/deliverable-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Link as LinkIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ id: string }>;
}

async function DeliverableDetail({ id }: { id: string }) {
    try {
        const deliverable = await api.deliverables.getById({ id });

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={
                                deliverable.status === "approved" ? "default" :
                                    deliverable.status === "changes_requested" ? "destructive" :
                                        deliverable.status === "pending_review" ? "secondary" : "outline"
                            } className="capitalize">
                                {deliverable.status.replace("_", " ")}
                            </Badge>
                            {deliverable.dueDate && (
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold">{deliverable.title}</h1>
                    </div>

                    <DeliverableActions id={deliverable.id} status={deliverable.status} />
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> Description
                                    </h3>
                                    <div className="text-muted-foreground whitespace-pre-wrap">
                                        {deliverable.description || "No description provided."}
                                    </div>
                                </div>

                                {deliverable.docLink && (
                                    <div className="pt-4 border-t">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <LinkIcon className="h-4 w-4" /> Attached Resource
                                        </h3>
                                        <Button asChild variant="outline" className="w-full justify-start">
                                            <a href={deliverable.docLink} target="_blank" rel="noopener noreferrer">
                                                {deliverable.docLink}
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Preview Image if available */}
                        {deliverable.previewImage && (
                            <Card>
                                <CardContent className="p-0 overflow-hidden rounded-lg bg-muted/20">
                                    {/* Ideally utilize Next.js Image with remote patterns configured, 
                                        using standard img for now to avoid config overhead */}
                                    <img
                                        src={deliverable.previewImage}
                                        alt="Preview"
                                        className="w-full h-auto object-cover max-h-[500px]"
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4">Activity</h3>
                                <div className="text-sm text-muted-foreground">
                                    <div className="flex justify-between py-2 border-b">
                                        <span>Created</span>
                                        <span>{new Date(deliverable.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span>Last Updated</span>
                                        <span>{new Date(deliverable.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    } catch (e) {
        notFound();
    }
}

export default async function DeliverableDetailPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <Button asChild variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/portal/deliverables" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Deliverables
                </Link>
            </Button>

            <Suspense fallback={<div>Loading details...</div>}>
                <DeliverableDetail id={id} />
            </Suspense>
        </div>
    );
}
