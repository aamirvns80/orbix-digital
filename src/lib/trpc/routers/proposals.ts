import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../server";
import { proposals, proposalItems } from "@/db/schema";
import { leads } from "@/db/schema/leads";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const proposalItemSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
});

export const proposalsRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.query.proposals.findMany({
                orderBy: [desc(proposals.createdAt)],
                with: {
                    lead: true, // Assuming relation exists, might need manual join if not defined in schema relations
                },
            });
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const proposal = await ctx.db.query.proposals.findFirst({
                where: eq(proposals.id, input.id),
                with: {
                    // items: true, // Need to define relations in schema first
                },
            });

            if (!proposal) return null;

            const items = await ctx.db
                .select()
                .from(proposalItems)
                .where(eq(proposalItems.proposalId, input.id));

            return { ...proposal, items };
        }),

    create: protectedProcedure
        .input(z.object({
            leadId: z.string().uuid(),
            title: z.string().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
            // Generate a random 12-char token
            const token = Math.random().toString(36).substring(2, 14);

            const [created] = await ctx.db
                .insert(proposals)
                .values({
                    leadId: input.leadId,
                    title: input.title,
                    token: token,
                    status: "draft",
                    totalAmount: "0",
                })
                .returning();

            return created;
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            title: z.string().optional(),
            content: z.string().optional(),
            items: z.array(proposalItemSchema).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, items, ...data } = input;

            // Update info
            if (Object.keys(data).length > 0) {
                await ctx.db
                    .update(proposals)
                    .set({ ...data, updatedAt: new Date() })
                    .where(eq(proposals.id, id));
            }

            // Update items if provided
            if (items) {
                // simple replace strategy: delete all, re-insert
                await ctx.db.delete(proposalItems).where(eq(proposalItems.proposalId, id));

                let total = 0;
                if (items.length > 0) {
                    const itemsWithId = items.map((item) => {
                        const amount = item.quantity * item.unitPrice;
                        total += amount;
                        return {
                            proposalId: id,
                            description: item.description,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice.toString(),
                            amount: amount.toString(),
                        };
                    });
                    await ctx.db.insert(proposalItems).values(itemsWithId);
                }

                // Update total amount on proposal
                await ctx.db
                    .update(proposals)
                    .set({ totalAmount: total.toString(), updatedAt: new Date() })
                    .where(eq(proposals.id, id));
            }

            return { success: true };
        }),

    getPublic: publicProcedure
        .input(z.object({ token: z.string() }))
        .query(async ({ ctx, input }) => {
            const proposal = await ctx.db.query.proposals.findFirst({
                where: eq(proposals.token, input.token),
            });

            if (!proposal) throw new TRPCError({ code: "NOT_FOUND" });

            const items = await ctx.db
                .select()
                .from(proposalItems)
                .where(eq(proposalItems.proposalId, proposal.id));

            // Get lead details (client info)
            const lead = await ctx.db.query.leads.findFirst({
                where: eq(leads.id, proposal.leadId),
            });

            return { ...proposal, items, lead };
        }),

    accept: publicProcedure
        .input(z.object({ id: z.string().uuid(), token: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Verify token matches id for security
            const proposal = await ctx.db.query.proposals.findFirst({
                where: eq(proposals.id, input.id),
            });

            if (!proposal || proposal.token !== input.token) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            await ctx.db
                .update(proposals)
                .set({ status: "accepted", updatedAt: new Date() })
                .where(eq(proposals.id, input.id));

            // Ideally trigger "Lead Won" automation here!

            return { success: true };
        }),
});
