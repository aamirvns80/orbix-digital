"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, Send, ExternalLink, ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function InvoiceBuilderPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const utils = trpc.useUtils();

    const { data: invoice, isLoading } = trpc.invoices.getById.useQuery({ id }, {
        enabled: id !== "new",
    });

    const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
    const [items, setItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([
        { description: "Service Item 1", quantity: 1, unitPrice: 0 }
    ]);

    useEffect(() => {
        if (invoice) {
            setDueDate(new Date(invoice.dueDate));
            if (invoice.items && invoice.items.length > 0) {
                setItems(invoice.items.map(i => ({
                    description: i.description,
                    quantity: i.quantity,
                    unitPrice: Number(i.unitPrice)
                })));
            }
        }
    }, [invoice]);

    const updateInvoice = trpc.invoices.update.useMutation({
        onSuccess: () => {
            toast.success("Invoice saved");
            utils.invoices.getById.invalidate({ id });
        },
    });

    const createInvoice = trpc.invoices.create.useMutation({
        onSuccess: (data) => {
            toast.success("Invoice created");
            router.push(`/dashboard/invoices/${data.id}`);
        },
    });

    const handleSave = () => {
        if (!dueDate) {
            toast.error("Due Date is required");
            return;
        }

        if (id === "new") {
            // Mock Lead ID for now - In real app, user selects lead
            // For MVP, we need to fail gracefully or pick a lead.
            // Let's prompt user to create via API or just fail if no lead ID provided (which we can't do here easily without UI)
            // Allow creating ONLY if we can pick a lead.
            toast.error("Please create invoices from the Client's page or wait for Lead Picker updates.");
            return;
        }

        updateInvoice.mutate({
            id,
            status: "draft",
            items,
        });
    };

    const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxRate = 0; // Fixed for now
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/invoices">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {id === "new" ? "New Invoice" : `Invoice ${invoice?.number}`}
                    </h1>
                    <p className="text-muted-foreground">
                        {invoice?.status.toUpperCase()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleSave} disabled={updateInvoice.isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                    {invoice && (
                        <Link href={`/i/${invoice.token}`} target="_blank">
                            <Button variant="secondary">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </Link>
                    )}
                    <Button>
                        <Send className="mr-2 h-4 w-4" />
                        Send Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
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
                                        <TableHead className="w-[300px]">Description</TableHead>
                                        <TableHead className="w-[80px]">Qty</TableHead>
                                        <TableHead className="w-[120px]">Price</TableHead>
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
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !dueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <DayPicker
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                                <span>${taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">${total.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
