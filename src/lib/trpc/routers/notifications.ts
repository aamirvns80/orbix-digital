import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../server";
import { notifications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const notificationsRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.query.notifications.findMany({
                where: eq(notifications.userId, ctx.session.user.id),
                orderBy: [desc(notifications.createdAt)],
                limit: 20,
            });
        }),

    getUnreadCount: protectedProcedure
        .query(async ({ ctx }) => {
            const result = await ctx.db.query.notifications.findMany({
                where: and(
                    eq(notifications.userId, ctx.session.user.id),
                    eq(notifications.isRead, false)
                ),
            });
            return result.length;
        }),

    markAsRead: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(notifications)
                .set({ isRead: true })
                .where(and(
                    eq(notifications.id, input.id),
                    eq(notifications.userId, ctx.session.user.id)
                ));
            return { success: true };
        }),

    markAllAsRead: protectedProcedure
        .mutation(async ({ ctx }) => {
            await ctx.db
                .update(notifications)
                .set({ isRead: true })
                .where(eq(notifications.userId, ctx.session.user.id));
            return { success: true };
        }),
});
