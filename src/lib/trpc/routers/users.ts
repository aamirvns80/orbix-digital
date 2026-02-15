import { z } from "zod";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
    adminProcedure,
} from "../server";

export const usersRouter = createTRPCRouter({
    me: protectedProcedure.query(async ({ ctx }) => {
        const [user] = await ctx.db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, ctx.user.id!))
            .limit(1);
        return user ?? null;
    }),

    list: adminProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(20),
                offset: z.number().min(0).default(0),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 20;
            const offset = input?.offset ?? 0;
            const result = await ctx.db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    role: users.role,
                    isActive: users.isActive,
                    createdAt: users.createdAt,
                })
                .from(users)
                .limit(limit)
                .offset(offset);
            return result;
        }),

    updateRole: adminProcedure
        .input(
            z.object({
                userId: z.string().uuid(),
                role: z.enum(["admin", "team", "client"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [updated] = await ctx.db
                .update(users)
                .set({ role: input.role, updatedAt: new Date() })
                .where(eq(users.id, input.userId))
                .returning();
            return updated;
        }),
});
