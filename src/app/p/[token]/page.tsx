"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Calendar, Activity } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { useState, useEffect } from "react";

export default function PublicProposalPage({ params }: { params: { token: string } }) {
    const { token } = params;
    const { data: proposal, isLoading, refetch } = trpc.proposals.getPublic.useQuery({ token });
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }
    }, []);

    const acceptProposal = trpc.proposals.accept.useMutation({
        onSuccess: () => {
            toast.success("Proposal accepted! Thank you.");
            setShowConfetti(true);
            refetch();
            setTimeout(() => setShowConfetti(false), 8000);
        },
        onError: () => {
            toast.error("Failed to accept proposal. It may be expired.");
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Activity className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-2xl font-bold text-gray-900">Proposal Not Found</h1>
                <p className="text-gray-500 mt-2">This link may be invalid or expired.</p>
            </div>
        );
    }

    const { items, lead } = proposal;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Badge variant={proposal.status === "accepted" ? "default" : "outline"} className="mb-2">
                        {proposal.status.toUpperCase()}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{proposal.title}</h1>
                    <p className="text-gray-500 mt-1">
                        Prepared for <span className="font-semibold text-gray-900">{(lead as any)?.firstName} {(lead as any)?.lastName}</span>
                        {(lead as any)?.company && ` at ${(lead as any)?.company}`}
                    </p>
                </div>
                {proposal.status !== "accepted" && (
                    <Button size="lg" onClick={() => acceptProposal.mutate({ id: proposal.id, token })} disabled={acceptProposal.isPending}>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Accept Proposal
                    </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Services & Deliverables</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.description}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${Number(item.unitPrice).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${Number(item.amount).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold pt-4">Total</TableCell>
                                    <TableCell className="text-right font-bold pt-4 text-lg">
                                        ${Number(proposal.totalAmount).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2" /> Date</span>
                                <span className="font-medium">{format(new Date(proposal.createdAt), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Valid Until</span>
                                <span className="font-medium">
                                    {proposal.validUntil ? format(new Date(proposal.validUntil), "MMM d, yyyy") : "No Expiry"}
                                </span>
                            </div>
                            <div className="pt-2">
                                <p className="text-muted-foreground text-xs">
                                    By accepting this proposal, you agree to the Terms of Service and Privacy Policy of OrbixDigital.
                                </p>
                            </div>
                        </CardContent>
                        {proposal.status === "accepted" && (
                            <CardFooter className="bg-green-50 border-t items-center justify-center py-4">
                                <div className="flex items-center text-green-700 font-medium">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Account Accepted
                                </div>
                            </CardFooter>
                        )}
                    </Card>

                    <Button variant="outline" className="w-full" disabled>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF (Making Soon)
                    </Button>
                </div>
            </div>
        </div>
    );
}
