"use client";

import { use } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    Globe,
    Calendar,
    User,
    Send,
    Tag,
    Clock,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PipelineProgress } from "@/components/ui/pipeline";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

const STATUSES = ["new", "qualified", "proposal", "negotiation", "won", "lost"] as const;

const activityIcons: Record<string, string> = {
    email_open: "📧",
    email_click: "🔗",
    form_submit: "📝",
    page_visit: "👁️",
    call: "📞",
    meeting: "🤝",
    note: "📌",
    status_change: "🔄",
    score_change: "⭐",
};

export default function LeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [noteContent, setNoteContent] = useState("");

    const { data: lead, isLoading, refetch } = trpc.leads.getById.useQuery({ id });
    const updateStatus = trpc.leads.updateStatus.useMutation({
        onSuccess: () => {
            refetch();
            toast("Status updated");
        },
    });
    const addNote = trpc.leadNotes.create.useMutation({
        onSuccess: () => {
            setNoteContent("");
            refetch();
            toast("Note added");
        },
    });

    if (isLoading) {
        return (
            <Container>
                <div className="flex items-center justify-center h-64 mt-8">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            </Container>
        );
    }

    if (!lead) {
        return (
            <Container>
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">Lead not found.</p>
                    <Link href="/dashboard/leads">
                        <Button variant="outline" className="mt-4">Back to Leads</Button>
                    </Link>
                </div>
            </Container>
        );
    }

    const displayName = lead.firstName || lead.lastName
        ? `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim()
        : lead.email;

    return (
        <Container>
            <div className="space-y-6 py-2">
                {/* Back + Header */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/leads">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Left: Profile */}
                    <div className="flex-1 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold">{displayName}</h1>
                                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                                            <StatusBadge status={lead.status} />
                                            <span className="text-sm font-semibold text-primary">
                                                Score: {lead.score}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pipeline bar */}
                                <div className="mt-4">
                                    <PipelineProgress status={lead.status} />
                                </div>

                                {/* Status Actions */}
                                <div className="flex items-center gap-2 mt-4 flex-wrap">
                                    {STATUSES.map((s) => (
                                        <Button
                                            key={s}
                                            variant={lead.status === s ? "default" : "outline"}
                                            size="sm"
                                            onClick={() =>
                                                updateStatus.mutate({ id: lead.id, status: s })
                                            }
                                            disabled={lead.status === s}
                                        >
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </Button>
                                    ))}
                                </div>

                                {/* Contact info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                                            {lead.email}
                                        </a>
                                    </div>
                                    {lead.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            {lead.phone}
                                        </div>
                                    )}
                                    {lead.company && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            {lead.company}
                                        </div>
                                    )}
                                    {lead.website && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                                                {lead.website}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Created {new Date(lead.createdAt).toLocaleDateString()}
                                    </div>
                                    {lead.source && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            Source: {lead.source}
                                        </div>
                                    )}
                                </div>

                                {/* Service interest, budget, timeline */}
                                {(lead.serviceInterest as string[])?.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Services</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(lead.serviceInterest as string[]).map((s) => (
                                                <Badge key={s} variant="outline">{s}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 mt-4 text-sm">
                                    {lead.budget && (
                                        <div>
                                            <span className="text-muted-foreground">Budget:</span>{" "}
                                            <span className="font-medium">{lead.budget}</span>
                                        </div>
                                    )}
                                    {lead.timeline && (
                                        <div>
                                            <span className="text-muted-foreground">Timeline:</span>{" "}
                                            <span className="font-medium">{lead.timeline}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {lead.tags.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Tags</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {lead.tags.map((tag) => (
                                                <Badge
                                                    key={tag.id}
                                                    style={{ backgroundColor: `${tag.color}20`, color: tag.color ?? undefined }}
                                                >
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* UTM data */}
                                {(lead.utmSource || lead.utmCampaign) && (
                                    <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs">
                                        <p className="font-medium mb-1">Tracking</p>
                                        <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                                            {lead.utmSource && <span>Source: {lead.utmSource}</span>}
                                            {lead.utmMedium && <span>Medium: {lead.utmMedium}</span>}
                                            {lead.utmCampaign && <span>Campaign: {lead.utmCampaign}</span>}
                                            {lead.utmTerm && <span>Term: {lead.utmTerm}</span>}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Activity + Notes */}
                    <div className="w-full md:w-[400px] space-y-4">
                        <Tabs defaultValue="activity">
                            <TabsList className="w-full">
                                <TabsTrigger value="activity" className="flex-1">
                                    Activity ({lead.activities.length})
                                </TabsTrigger>
                                <TabsTrigger value="notes" className="flex-1">
                                    Notes ({lead.notes.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="activity">
                                <Card>
                                    <CardContent className="p-4">
                                        {lead.activities.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-8">
                                                No activity yet
                                            </p>
                                        ) : (
                                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                                {lead.activities.map((activity) => (
                                                    <div
                                                        key={activity.id}
                                                        className="flex gap-3 text-sm border-b border-border pb-3 last:border-0"
                                                    >
                                                        <span className="text-lg flex-shrink-0">
                                                            {activityIcons[activity.type] ?? "📋"}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="font-medium">
                                                                {activity.description ?? activity.type.replace(/_/g, " ")}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(activity.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notes">
                                <Card>
                                    <CardContent className="p-4 space-y-4">
                                        {/* Add note */}
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (!noteContent.trim()) return;
                                                addNote.mutate({ leadId: id, content: noteContent });
                                            }}
                                            className="space-y-2"
                                        >
                                            <Textarea
                                                placeholder="Add a note..."
                                                value={noteContent}
                                                onChange={(e) => setNoteContent(e.target.value)}
                                                className="min-h-[80px]"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={!noteContent.trim() || addNote.isPending}
                                            >
                                                <Send className="h-3.5 w-3.5 mr-1" /> Add Note
                                            </Button>
                                        </form>

                                        {/* Notes list */}
                                        {lead.notes.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                No notes yet
                                            </p>
                                        ) : (
                                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                                {lead.notes.map((note) => (
                                                    <div
                                                        key={note.id}
                                                        className="p-3 rounded-lg bg-muted/30 text-sm"
                                                    >
                                                        <p className="whitespace-pre-wrap">{note.content}</p>
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {new Date(note.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Container>
    );
}
