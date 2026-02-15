import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { contacts } from "@/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../server";

export const contactsRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(20),
                offset: z.number().min(0).default(0),
                status: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost"]).optional(),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 20;
            const offset = input?.offset ?? 0;
            let query = ctx.db
                .select()
                .from(contacts)
                .orderBy(desc(contacts.createdAt))
                .limit(limit)
                .offset(offset);

            return query;
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const [contact] = await ctx.db
                .select()
                .from(contacts)
                .where(eq(contacts.id, input.id))
                .limit(1);
            return contact ?? null;
        }),

    create: protectedProcedure
        .input(
            z.object({
                firstName: z.string().min(1).max(100),
                lastName: z.string().min(1).max(100),
                email: z.string().email(),
                phone: z.string().optional(),
                title: z.string().optional(),
                status: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost"]).default("new"),
                source: z.string().optional(),
                notes: z.string().optional(),
                companyId: z.string().uuid().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(contacts)
                .values({
                    ...input,
                    assignedToId: ctx.user.id,
                })
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                firstName: z.string().min(1).max(100).optional(),
                lastName: z.string().min(1).max(100).optional(),
                email: z.string().email().optional(),
                phone: z.string().optional(),
                title: z.string().optional(),
                status: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost"]).optional(),
                source: z.string().optional(),
                notes: z.string().optional(),
                companyId: z.string().uuid().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const [updated] = await ctx.db
                .update(contacts)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(contacts.id, id))
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(contacts).where(eq(contacts.id, input.id));
            return { success: true };
        }),
});
