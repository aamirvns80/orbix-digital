import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { companies } from "@/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../server";

export const companiesRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(20),
                offset: z.number().min(0).default(0),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 20;
            const offset = input?.offset ?? 0;
            return ctx.db
                .select()
                .from(companies)
                .orderBy(desc(companies.createdAt))
                .limit(limit)
                .offset(offset);
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const [company] = await ctx.db
                .select()
                .from(companies)
                .where(eq(companies.id, input.id))
                .limit(1);
            return company ?? null;
        }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1).max(200),
                website: z.string().url().optional(),
                industry: z.string().optional(),
                address: z.string().optional(),
                phone: z.string().optional(),
                email: z.string().email().optional(),
                notes: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(companies)
                .values(input)
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                name: z.string().min(1).max(200).optional(),
                website: z.string().url().optional(),
                industry: z.string().optional(),
                address: z.string().optional(),
                phone: z.string().optional(),
                email: z.string().email().optional(),
                notes: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const [updated] = await ctx.db
                .update(companies)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(companies.id, id))
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(companies).where(eq(companies.id, input.id));
            return { success: true };
        }),
});
