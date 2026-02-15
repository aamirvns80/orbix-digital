import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../server";
import { tickets, ticketStatusEnum, ticketPriorityEnum } from "@/db/schema/tickets";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { workflowEngine } from "@/lib/workflow-engine";

export const ticketsRouter = createTRPCRouter({
    listByCompany: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.session.user;
        const companyId = (user as any).companyId;

        if (!companyId && (user as any).role !== "admin") return [];

        // If admin, show all? Or just their assigned ones? 
        // For simplicity, if admin, show all. If client, show company's.
        if ((user as any).role === "admin") {
            return ctx.db.select().from(tickets).orderBy(desc(tickets.createdAt));
        }

        return ctx.db
            .select()
            .from(tickets)
            .where(eq(tickets.companyId, companyId))
            .orderBy(desc(tickets.createdAt));
    }),

    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().min(1),
                priority: z.enum(ticketPriorityEnum.enumValues).default("medium"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user;
            const companyId = (user as any).companyId;

            if (!companyId) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "User not linked to a company" });
            }

            const [created] = await ctx.db
                .insert(tickets)
                .values({
                    title: input.title,
                    description: input.description,
                    priority: input.priority,
                    companyId: companyId,
                    requesterId: user.id,
                    status: "open",
                })
                .returning();

            // Trigger automation
            await workflowEngine.trigger("ticket_created", {
                ticketId: created.id,
                title: created.title,
                priority: created.priority ?? "medium",
                createdBy: user.id
            });

            return created;
        }),

    updateStatus: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(ticketStatusEnum.enumValues),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user;

            // Only admins can update status for now (or assigned agents)
            if ((user as any).role !== "admin" && (user as any).role !== "team") {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const [updated] = await ctx.db
                .update(tickets)
                .set({
                    status: input.status,
                    updatedAt: new Date(),
                })
                .where(eq(tickets.id, input.id))
                .returning();

            return updated;
        }),
});
