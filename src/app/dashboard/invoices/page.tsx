"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, FileText, CheckCircle, XCircle, Clock, Send, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function InvoicesPage() {
    const [search, setSearch] = useState("");
    const { data: invoices, isLoading } = trpc.invoices.list.useQuery();

    const filteredInvoices = invoices?.filter((inv) =>
        inv.number.toLowerCase().includes(search.toLowerCase()) ||
        (inv.lead as any)?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        (inv.lead as any)?.company?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "draft":
                return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Draft</Badge>;
            case "pending":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case "paid":
                return <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Paid</Badge>;
            case "overdue":
                return <Badge variant="secondary" className="bg-red-100 text-red-700"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</Badge>;
            case "cancelled":
                return <Badge variant="outline" className="text-muted-foreground">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-muted-foreground">Manage billing and track payments.</p>
                </div>
                <Link href="/dashboard/invoices/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                    </Button>
                </Link>
            </div>

            <div className="flex items-center max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search invoices..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredInvoices?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <FileText className="h-8 w-8 mb-2 opacity-20" />
                                        <p>No invoices found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices?.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:underline">
                                            {invoice.number}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {(invoice.lead as any)?.company || (invoice.lead as any)?.email}
                                    </TableCell>
                                    <TableCell>
                                        ${Number(invoice.totalAmount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                    <TableCell>{format(new Date(invoice.issueDate), "MMM d, yyyy")}</TableCell>
                                    <TableCell>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/dashboard/invoices/${invoice.id}`}>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
