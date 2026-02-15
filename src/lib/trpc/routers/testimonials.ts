import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { testimonials } from "@/db/schema";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "../server";

export const testimonialsRouter = createTRPCRouter({
    listFeatured: publicProcedure.query(async ({ ctx }) => {
        return ctx.db
            .select()
            .from(testimonials)
            .where(eq(testimonials.featured, true))
            .orderBy(desc(testimonials.createdAt));
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db
            .select()
            .from(testimonials)
            .orderBy(desc(testimonials.createdAt));
    }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                title: z.string().min(1),
                company: z.string().min(1),
                avatar: z.string().url().optional(),
                quote: z.string().min(10),
                rating: z.number().min(1).max(5).default(5),
                featured: z.boolean().default(false),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(testimonials)
                .values(input)
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                name: z.string().min(1).optional(),
                title: z.string().min(1).optional(),
                company: z.string().min(1).optional(),
                avatar: z.string().url().optional(),
                quote: z.string().min(10).optional(),
                rating: z.number().min(1).max(5).optional(),
                featured: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const [updated] = await ctx.db
                .update(testimonials)
                .set(data)
                .where(eq(testimonials.id, id))
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(testimonials).where(eq(testimonials.id, input.id));
            return { success: true };
        }),
});
