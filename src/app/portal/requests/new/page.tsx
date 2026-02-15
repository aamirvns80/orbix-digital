"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewRequestPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
    });

    const createTicket = api.tickets.create.useMutation({
        onSuccess: () => {
            toast({ title: "Request submitted successfully" });
            router.push("/portal/requests");
            router.refresh();
        },
        onError: (error) => {
            toast({ title: "Error submitting request", description: error.message, variant: "destructive" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTicket.mutate({
            title: formData.title,
            description: formData.description,
            priority: formData.priority as "low" | "medium" | "high" | "urgent",
        });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Button asChild variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/portal/requests" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Requests
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Submit New Request</CardTitle>
                    <CardDescription>
                        Describe your issue or project idea, and we'll get back to you shortly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Update homepage banner"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Select
                                id="priority"
                                label="Priority"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                options={[
                                    { value: "low", label: "Low" },
                                    { value: "medium", label: "Medium" },
                                    { value: "high", label: "High" },
                                    { value: "urgent", label: "Urgent" },
                                ]}
                                placeholder="Select priority"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Please provide details..."
                                className="min-h-[150px]"
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createTicket.isPending}>
                                {createTicket.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
