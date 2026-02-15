import { z } from "zod";
import { desc } from "drizzle-orm";
import { activityLogs } from "@/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
    adminProcedure,
} from "../server";

export const activityRouter = createTRPCRouter({
    list: adminProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(50),
                offset: z.number().min(0).default(0),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 50;
            const offset = input?.offset ?? 0;
            return ctx.db
                .select()
                .from(activityLogs)
                .orderBy(desc(activityLogs.createdAt))
                .limit(limit)
                .offset(offset);
        }),

    log: protectedProcedure
        .input(
            z.object({
                action: z.string().min(1),
                entityType: z.string().min(1),
                entityId: z.string().uuid().optional(),
                metadata: z.record(z.string(), z.any()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(activityLogs)
                .values({
                    ...input,
                    userId: ctx.user.id,
                })
                .returning();
            return created;
        }),
});
