import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { leadActivities } from "@/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../server";

export const leadActivitiesRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                leadId: z.string().uuid(),
                limit: z.number().min(1).max(100).default(50),
                offset: z.number().min(0).default(0),
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.db
                .select()
                .from(leadActivities)
                .where(eq(leadActivities.leadId, input.leadId))
                .orderBy(desc(leadActivities.createdAt))
                .limit(input.limit)
                .offset(input.offset);
        }),

    create: protectedProcedure
        .input(
            z.object({
                leadId: z.string().uuid(),
                type: z.enum([
                    "email_open",
                    "email_click",
                    "form_submit",
                    "page_visit",
                    "call",
                    "meeting",
                    "note",
                    "status_change",
                    "score_change",
                ]),
                description: z.string().optional(),
                metadata: z.record(z.string(), z.any()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(leadActivities)
                .values({
                    ...input,
                    userId: ctx.user.id,
                })
                .returning();
            return created;
        }),
});
