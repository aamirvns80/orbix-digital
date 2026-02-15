import { z } from "zod";
import { eq } from "drizzle-orm";
import { tags } from "@/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
    adminProcedure,
} from "../server";

export const tagsRouter = createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.select().from(tags).orderBy(tags.name);
    }),

    create: adminProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(tags)
                .values(input)
                .returning();
            return created;
        }),

    update: adminProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                name: z.string().min(1).max(50).optional(),
                color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const [updated] = await ctx.db
                .update(tags)
                .set(data)
                .where(eq(tags.id, id))
                .returning();
            return updated;
        }),

    delete: adminProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(tags).where(eq(tags.id, input.id));
            return { success: true };
        }),
});
