"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc/react"; // Client side for mutations
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DeliverableActions({ id, status }: { id: string, status: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const updateStatus = api.deliverables.updateStatus.useMutation({
        onSuccess: () => {
            router.refresh();
            toast({ title: "Status updated successfully" });
        },
        onError: (error) => {
            toast({ title: "Error updating status", description: error.message, variant: "destructive" });
        }
    });

    const handleUpdate = (newStatus: "approved" | "changes_requested") => {
        updateStatus.mutate({ id, status: newStatus });
    };

    if (status === "approved") {
        return (
            <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                <CheckCircle className="h-5 w-5" />
                Approved
            </div>
        );
    }

    return (
        <div className="flex gap-4">
            <Button
                onClick={() => handleUpdate("approved")}
                disabled={isPending || status === "approved"}
                className="bg-green-600 hover:bg-green-700 text-white"
            >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
            </Button>
            <Button
                variant="outline"
                onClick={() => handleUpdate("changes_requested")}
                disabled={isPending || status === "changes_requested"}
                className="text-destructive hover:bg-destructive/10 border-destructive/20"
            >
                <XCircle className="mr-2 h-4 w-4" />
                Request Changes
            </Button>
        </div>
    );
}
