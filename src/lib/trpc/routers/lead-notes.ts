import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { leadNotes } from "@/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../server";

export const leadNotesRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                leadId: z.string().uuid(),
                limit: z.number().min(1).max(100).default(20),
                offset: z.number().min(0).default(0),
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.db
                .select()
                .from(leadNotes)
                .where(eq(leadNotes.leadId, input.leadId))
                .orderBy(desc(leadNotes.createdAt))
                .limit(input.limit)
                .offset(input.offset);
        }),

    create: protectedProcedure
        .input(
            z.object({
                leadId: z.string().uuid(),
                content: z.string().min(1).max(5000),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(leadNotes)
                .values({
                    ...input,
                    userId: ctx.user.id,
                })
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                content: z.string().min(1).max(5000),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [updated] = await ctx.db
                .update(leadNotes)
                .set({ content: input.content, updatedAt: new Date() })
                .where(eq(leadNotes.id, input.id))
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(leadNotes).where(eq(leadNotes.id, input.id));
            return { success: true };
        }),
});
