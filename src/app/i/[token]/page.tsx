"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Calendar, Activity, CreditCard, Lock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PublicInvoicePage({ params }: { params: { token: string } }) {
    const { token } = params;
    const { data: invoice, isLoading, refetch } = trpc.invoices.getPublic.useQuery({ token });
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }
    }, []);

    const markPaid = trpc.invoices.markPaid.useMutation({
        onSuccess: () => {
            toast.success("Payment successful! Receipt emailed.");
            setShowConfetti(true);
            setIsPaymentModalOpen(false);
            setIsProcessing(false);
            refetch();
            setTimeout(() => setShowConfetti(false), 8000);
        },
        onError: () => {
            setIsProcessing(false);
            toast.error("Payment failed. Please try again.");
        }
    });

    const handleMockPayment = async () => {
        setIsProcessing(true);
        // Simulate network delay
        setTimeout(() => {
            if (invoice) {
                markPaid.mutate({ id: invoice.id, token });
            }
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Activity className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-2xl font-bold text-gray-900">Invoice Not Found</h1>
                <p className="text-gray-500 mt-2">This link may be invalid or expired.</p>
            </div>
        );
    }

    const { items, lead } = invoice;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-base px-3 py-1">
                            {invoice.number}
                        </Badge>
                        <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                            {invoice.status.toUpperCase()}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
                    <p className="text-gray-500 mt-1">
                        Billed to <span className="font-semibold text-gray-900">{(lead as any)?.firstName} {(lead as any)?.lastName}</span>
                        {(lead as any)?.company && ` at ${(lead as any)?.company}`}
                    </p>
                </div>
                {invoice.status !== "paid" && (
                    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg">
                                <CreditCard className="mr-2 h-5 w-5" />
                                Pay ${Number(invoice.totalAmount).toLocaleString()}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Secure Payment</DialogTitle>
                                <DialogDescription>
                                    Enter your card details to pay invoice {invoice.number}.
                                    <br />
                                    <span className="text-xs text-amber-600 font-semibold">(Demo Mode: No real charge will be made)</span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="expiry">Expiry</Label>
                                        <Input id="expiry" placeholder="MM/YY" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleMockPayment} disabled={isProcessing} className="w-full">
                                    {isProcessing ? <Activity className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                                    {isProcessing ? "Processing..." : `Pay $${Number(invoice.totalAmount).toLocaleString()}`}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
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
                                    <TableCell colSpan={3} className="text-right font-medium pt-4">Subtotal</TableCell>
                                    <TableCell className="text-right font-medium pt-4">
                                        ${Number(invoice.subtotal).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right text-muted-foreground border-0">Tax</TableCell>
                                    <TableCell className="text-right text-muted-foreground border-0">
                                        ${Number(invoice.taxAmount).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold text-lg border-t-2">Total</TableCell>
                                    <TableCell className="text-right font-bold text-lg border-t-2 text-primary">
                                        ${Number(invoice.totalAmount).toLocaleString()}
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
                                <span className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2" /> Issue Date</span>
                                <span className="font-medium">{format(new Date(invoice.issueDate), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Due Date</span>
                                <span className="font-medium text-red-600">
                                    {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                                </span>
                            </div>
                        </CardContent>
                        {invoice.status === "paid" && (
                            <CardFooter className="bg-green-50 border-t items-center justify-center py-4">
                                <div className="flex items-center text-green-700 font-medium">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Paid in Full
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
