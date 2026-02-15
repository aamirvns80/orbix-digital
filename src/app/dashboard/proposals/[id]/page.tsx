"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, Send, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

const proposalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    items: z.array(z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0),
    })),
});

export default function ProposalBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const utils = trpc.useUtils();

    const { data: proposal, isLoading } = trpc.proposals.getById.useQuery({ id }, {
        enabled: id !== "new",
    });

    // We'll use a simple form state management for now, 
    // real app should use React Hook Form for better validation handling
    const [title, setTitle] = useState("");
    const [items, setItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([
        { description: "Service Item 1", quantity: 1, unitPrice: 0 }
    ]);

    useEffect(() => {
        if (proposal) {
            setTitle(proposal.title);
            if (proposal.items && proposal.items.length > 0) {
                setItems(proposal.items.map(i => ({
                    description: i.description,
                    quantity: i.quantity,
                    unitPrice: Number(i.unitPrice)
                })));
            }
        }
    }, [proposal]);

    const updateProposal = trpc.proposals.update.useMutation({
        onSuccess: () => {
            toast.success("Proposal saved");
            utils.proposals.getById.invalidate({ id });
        },
    });

    const createProposal = trpc.proposals.create.useMutation({
        onSuccess: (data) => {
            toast.success("Proposal created");
            router.push(`/dashboard/proposals/${data.id}`);
        },
    });

    const handleSave = () => {
        if (id === "new") {
            // For "new", we need a lead ID. 
            // In a real flow, you'd select a lead first. 
            // For this MVP, we'll mock a lead ID or require the user to pick one from a dropdown (omitted for brevity).
            toast.error("Please create from a Lead's page for now.");
            return;
        }

        updateProposal.mutate({
            id,
            title,
            items,
        });
    };

    const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${proposal?.token}` : "";

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/proposals">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {id === "new" ? "New Proposal" : "Edit Proposal"}
                    </h1>
                    <p className="text-muted-foreground">
                        {proposal?.token ? `Public Token: ${proposal.token}` : "Draft Mode"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleSave} disabled={updateProposal.isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                    {proposal && (
                        <Link href={`/p/${proposal.token}`} target="_blank">
                            <Button variant="secondary">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </Link>
                    )}
                    <Button>
                        <Send className="mr-2 h-4 w-4" />
                        Send to Client
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Proposal Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Website Redesign Q1"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Line Items</CardTitle>
                    <Button size="sm" variant="outline" onClick={addItem}>
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[400px]">Description</TableHead>
                                <TableHead className="w-[100px]">Qty</TableHead>
                                <TableHead className="w-[150px]">Price</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <Input
                                            value={item.description}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[idx].description = e.target.value;
                                                setItems(newItems);
                                            }}
                                            placeholder="Item description"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[idx].quantity = Number(e.target.value);
                                                setItems(newItems);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                className="pl-7"
                                                type="number"
                                                min="0"
                                                value={item.unitPrice}
                                                onChange={(e) => {
                                                    const newItems = [...items];
                                                    newItems[idx].unitPrice = Number(e.target.value);
                                                    setItems(newItems);
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ${(item.quantity * item.unitPrice).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end mt-6">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Estimate</p>
                            <p className="text-2xl font-bold text-primary">${total.toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
