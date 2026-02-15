import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../server";
import { invoices, invoiceItems } from "@/db/schema";
import { leads } from "@/db/schema/leads";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const invoiceItemSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
});

export const invoicesRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.query.invoices.findMany({
                orderBy: [desc(invoices.issueDate)],
                with: {
                    lead: true,
                },
            });
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const invoice = await ctx.db.query.invoices.findFirst({
                where: eq(invoices.id, input.id),
                with: {
                    lead: true,
                },
            });

            if (!invoice) return null;

            const items = await ctx.db
                .select()
                .from(invoiceItems)
                .where(eq(invoiceItems.invoiceId, input.id));

            return { ...invoice, items };
        }),

    create: protectedProcedure
        .input(z.object({
            leadId: z.string().uuid(),
            dueDate: z.string(), // ISO date string
        }))
        .mutation(async ({ ctx, input }) => {
            // Generate a random 12-char token
            const token = Math.random().toString(36).substring(2, 14);

            // Generate Invoice Number (Simple sequential logic or timestamp based for now)
            // In real app, querying last invoice number and incrementing is better.
            const invNumber = `INV-${Date.now().toString().slice(-6)}`;

            const [created] = await ctx.db
                .insert(invoices)
                .values({
                    leadId: input.leadId,
                    number: invNumber,
                    token: token,
                    status: "draft",
                    issueDate: new Date().toISOString().split('T')[0], // Today
                    dueDate: input.dueDate,
                    subtotal: "0",
                    taxRate: "0",
                    taxAmount: "0",
                    totalAmount: "0",
                })
                .returning();

            return created;
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            status: z.enum(["draft", "pending", "paid", "overdue", "cancelled"]).optional(),
            items: z.array(invoiceItemSchema).optional(),
            // Add other fields as needed
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, items, ...data } = input;

            // Update info
            if (Object.keys(data).length > 0) {
                await ctx.db
                    .update(invoices)
                    .set({ ...data, updatedAt: new Date() })
                    .where(eq(invoices.id, id));
            }

            // Update items if provided
            if (items) {
                // simple replace strategy
                await ctx.db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));

                let subtotal = 0;
                if (items.length > 0) {
                    const itemsWithId = items.map((item) => {
                        const amount = item.quantity * item.unitPrice;
                        subtotal += amount;
                        return {
                            invoiceId: id,
                            description: item.description,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice.toString(),
                            amount: amount.toString(),
                        };
                    });
                    await ctx.db.insert(invoiceItems).values(itemsWithId);
                }

                // Recalculate totals (assuming 0 tax for now, can add tax logic later)
                const taxRate = 0; // Fetch from invoice if we want to support changing tax
                const taxAmount = subtotal * (taxRate / 100);
                const total = subtotal + taxAmount;

                await ctx.db
                    .update(invoices)
                    .set({
                        subtotal: subtotal.toString(),
                        taxAmount: taxAmount.toString(),
                        totalAmount: total.toString(),
                        updatedAt: new Date()
                    })
                    .where(eq(invoices.id, id));
            }

            return { success: true };
        }),

    getPublic: publicProcedure
        .input(z.object({ token: z.string() }))
        .query(async ({ ctx, input }) => {
            const invoice = await ctx.db.query.invoices.findFirst({
                where: eq(invoices.token, input.token),
                with: {
                    lead: true,
                }
            });

            if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });

            const items = await ctx.db
                .select()
                .from(invoiceItems)
                .where(eq(invoiceItems.invoiceId, invoice.id));

            return { ...invoice, items };
        }),

    markPaid: publicProcedure // Ideally protected or secure webhook, but public for "Mock Payment" demo
        .input(z.object({ id: z.string().uuid(), token: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Verify token matches id for security
            const invoice = await ctx.db.query.invoices.findFirst({
                where: eq(invoices.id, input.id),
            });

            if (!invoice || invoice.token !== input.token) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            await ctx.db
                .update(invoices)
                .set({ status: "paid", updatedAt: new Date() })
                .where(eq(invoices.id, input.id));

            return { success: true };
        }),
});
