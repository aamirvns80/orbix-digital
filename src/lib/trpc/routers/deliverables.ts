import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../server";
import { deliverables, deliverableStatusEnum } from "@/db/schema/deliverables";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const deliverablesRouter = createTRPCRouter({
    listByCompany: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.session.user;
        const companyId = (user as any).companyId;

        if (!companyId && (user as any).role !== "admin") {
            return [];
        }

        // If admin, maybe list all? For now, let's just return empty if no company
        if (!companyId) return [];

        return ctx.db
            .select()
            .from(deliverables)
            .where(eq(deliverables.companyId, companyId))
            .orderBy(desc(deliverables.createdAt));
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = ctx.session.user;
            const companyId = (user as any).companyId;

            const [deliverable] = await ctx.db
                .select()
                .from(deliverables)
                .where(eq(deliverables.id, input.id))
                .limit(1);

            if (!deliverable) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            // Access control: User must belong to the company or be admin
            if ((user as any).role !== "admin" && deliverable.companyId !== companyId) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            return deliverable;
        }),

    updateStatus: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(deliverableStatusEnum.enumValues),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user;
            const companyId = (user as any).companyId;

            const [deliverable] = await ctx.db
                .select()
                .from(deliverables)
                .where(eq(deliverables.id, input.id))
                .limit(1);

            if (!deliverable) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            if ((user as any).role !== "admin" && deliverable.companyId !== companyId) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const [updated] = await ctx.db
                .update(deliverables)
                .set({
                    status: input.status,
                    updatedAt: new Date(),
                })
                .where(eq(deliverables.id, input.id))
                .returning();

            return updated;
        }),

    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().optional(),
                companyId: z.string(),
                docLink: z.string().url().optional(),
                previewImage: z.string().url().optional(),
                dueDate: z.date().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user;

            if ((user as any).role !== "admin") {
                throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create deliverables" });
            }

            const [created] = await ctx.db
                .insert(deliverables)
                .values({
                    title: input.title,
                    description: input.description,
                    companyId: input.companyId,
                    docLink: input.docLink,
                    previewImage: input.previewImage,
                    dueDate: input.dueDate,
                    status: "draft",
                })
                .returning();

            return created;
        }),
});
