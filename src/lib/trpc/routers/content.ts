import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { content } from "@/db/schema";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "../server";

export const contentRouter = createTRPCRouter({
    listPublished: publicProcedure
        .input(
            z.object({
                type: z.enum(["page", "post", "case_study"]).optional(),
                limit: z.number().min(1).max(100).default(20),
                offset: z.number().min(0).default(0),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 20;
            const offset = input?.offset ?? 0;
            return ctx.db
                .select()
                .from(content)
                .where(eq(content.status, "published"))
                .orderBy(desc(content.publishedAt))
                .limit(limit)
                .offset(offset);
        }),

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
                .from(content)
                .orderBy(desc(content.createdAt))
                .limit(limit)
                .offset(offset);
        }),

    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const [item] = await ctx.db
                .select()
                .from(content)
                .where(eq(content.slug, input.slug))
                .limit(1);
            return item ?? null;
        }),

    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1).max(300),
                slug: z.string().min(1).max(300).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
                type: z.enum(["page", "post", "case_study"]),
                status: z.enum(["draft", "published", "archived"]).default("draft"),
                excerpt: z.string().optional(),
                body: z.string().optional(),
                featuredImage: z.string().url().optional(),
                metadata: z.record(z.string(), z.any()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(content)
                .values({
                    ...input,
                    authorId: ctx.user.id,
                    publishedAt: input.status === "published" ? new Date() : null,
                })
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                title: z.string().min(1).max(300).optional(),
                slug: z.string().min(1).max(300).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
                type: z.enum(["page", "post", "case_study"]).optional(),
                status: z.enum(["draft", "published", "archived"]).optional(),
                excerpt: z.string().optional(),
                body: z.string().optional(),
                featuredImage: z.string().url().optional(),
                metadata: z.record(z.string(), z.any()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const updateData: any = { ...data, updatedAt: new Date() };
            if (data.status === "published") {
                updateData.publishedAt = new Date();
            }
            const [updated] = await ctx.db
                .update(content)
                .set(updateData)
                .where(eq(content.id, id))
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(content).where(eq(content.id, input.id));
            return { success: true };
        }),
});
