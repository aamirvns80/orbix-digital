"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, FileText, CheckCircle, XCircle, Clock, Send } from "lucide-react";
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

export default function ProposalsPage() {
    const [search, setSearch] = useState("");
    const { data: proposals, isLoading } = trpc.proposals.list.useQuery();

    const filteredProposals = proposals?.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.lead as any)?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        (p.lead as any)?.company?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "draft":
                return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Draft</Badge>;
            case "sent":
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700"><Send className="w-3 h-3 mr-1" /> Sent</Badge>;
            case "accepted":
                return <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Accepted</Badge>;
            case "rejected":
                return <Badge variant="secondary" className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
                    <p className="text-muted-foreground">Manage quotes and agreements for your leads.</p>
                </div>
                <Link href="/dashboard/proposals/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Proposal
                    </Button>
                </Link>
            </div>

            <div className="flex items-center max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search proposals..."
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
                            <TableHead>Title</TableHead>
                            <TableHead>Client / Lead</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredProposals?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <FileText className="h-8 w-8 mb-2 opacity-20" />
                                        <p>No proposals found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProposals?.map((proposal) => (
                                <TableRow key={proposal.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/dashboard/proposals/${proposal.id}`} className="hover:underline">
                                            {proposal.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {(proposal.lead as any)?.company || (proposal.lead as any)?.email}
                                    </TableCell>
                                    <TableCell>
                                        ${Number(proposal.totalAmount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                                    <TableCell>{format(new Date(proposal.createdAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/dashboard/proposals/${proposal.id}`}>
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
