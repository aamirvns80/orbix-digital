import { z } from "zod";
import { eq, desc, ilike, or, and, gte, lte, sql, inArray } from "drizzle-orm";
import { leads, leadActivities, leadNotes, tags, leadsToTags } from "@/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../server";
import { workflowEngine } from "@/lib/workflow-engine";

const leadCreateSchema = z.object({
    email: z.string().email(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    company: z.string().max(200).optional(),
    phone: z.string().max(50).optional(),
    website: z.string().url().optional(),
    serviceInterest: z.array(z.string()).optional(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    source: z.string().default("direct"),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    utmTerm: z.string().optional(),
    utmContent: z.string().optional(),
    status: z.enum(["new", "qualified", "proposal", "negotiation", "won", "lost"]).default("new"),
    score: z.number().int().min(0).max(100).default(0),
    assignedToId: z.string().uuid().optional(),
    companyId: z.string().uuid().optional(),
});

const leadUpdateSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    company: z.string().max(200).optional(),
    phone: z.string().max(50).optional(),
    website: z.string().url().optional(),
    serviceInterest: z.array(z.string()).optional(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    source: z.string().optional(),
    status: z.enum(["new", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
    score: z.number().int().min(0).max(100).optional(),
    assignedToId: z.string().uuid().nullable().optional(),
    companyId: z.string().uuid().nullable().optional(),
});

export const leadsRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(20),
                offset: z.number().min(0).default(0),
                status: z.enum(["new", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
                source: z.string().optional(),
                assignedToId: z.string().uuid().optional(),
                minScore: z.number().optional(),
                maxScore: z.number().optional(),
                search: z.string().optional(),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 20;
            const offset = input?.offset ?? 0;

            const conditions = [];
            if (input?.status) conditions.push(eq(leads.status, input.status));
            if (input?.source) conditions.push(eq(leads.source, input.source));
            if (input?.assignedToId) conditions.push(eq(leads.assignedToId, input.assignedToId));
            if (input?.minScore !== undefined) conditions.push(gte(leads.score, input.minScore));
            if (input?.maxScore !== undefined) conditions.push(lte(leads.score, input.maxScore));
            if (input?.search) {
                conditions.push(
                    or(
                        ilike(leads.email, `%${input.search}%`),
                        ilike(leads.firstName, `%${input.search}%`),
                        ilike(leads.lastName, `%${input.search}%`),
                        ilike(leads.company, `%${input.search}%`),
                    )!
                );
            }

            const where = conditions.length > 0 ? and(...conditions) : undefined;

            const [items, countResult] = await Promise.all([
                ctx.db
                    .select()
                    .from(leads)
                    .where(where)
                    .orderBy(desc(leads.createdAt))
                    .limit(limit)
                    .offset(offset),
                ctx.db
                    .select({ count: sql<number>`count(*)` })
                    .from(leads)
                    .where(where),
            ]);

            return {
                items,
                total: Number(countResult[0]?.count ?? 0),
                limit,
                offset,
            };
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const [lead] = await ctx.db
                .select()
                .from(leads)
                .where(eq(leads.id, input.id))
                .limit(1);

            if (!lead) return null;

            // Fetch related data in parallel
            const [activities, notes, leadTags] = await Promise.all([
                ctx.db
                    .select()
                    .from(leadActivities)
                    .where(eq(leadActivities.leadId, input.id))
                    .orderBy(desc(leadActivities.createdAt))
                    .limit(50),
                ctx.db
                    .select()
                    .from(leadNotes)
                    .where(eq(leadNotes.leadId, input.id))
                    .orderBy(desc(leadNotes.createdAt)),
                ctx.db
                    .select({ tag: tags })
                    .from(leadsToTags)
                    .innerJoin(tags, eq(leadsToTags.tagId, tags.id))
                    .where(eq(leadsToTags.leadId, input.id)),
            ]);

            return {
                ...lead,
                activities,
                notes,
                tags: leadTags.map((lt) => lt.tag),
            };
        }),

    create: protectedProcedure
        .input(leadCreateSchema)
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(leads)
                .values(input)
                .returning();

            // Log activity
            await ctx.db.insert(leadActivities).values({
                type: "form_submit",
                description: "Lead created",
                leadId: created.id,
                userId: ctx.user.id,
            });

            return created;
        }),

    update: protectedProcedure
        .input(leadUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            // Get current lead for change detection
            const [current] = await ctx.db
                .select()
                .from(leads)
                .where(eq(leads.id, id))
                .limit(1);

            const [updated] = await ctx.db
                .update(leads)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(leads.id, id))
                .returning();

            // Log status change
            if (data.status && current && data.status !== current.status) {
                await ctx.db.insert(leadActivities).values({
                    type: "status_change",
                    description: `Status changed from ${current.status} to ${data.status}`,
                    metadata: { from: current.status, to: data.status },
                    leadId: id,
                    userId: ctx.user.id,
                });
            }

            // Log score change
            if (data.score !== undefined && current && data.score !== current.score) {
                await ctx.db.insert(leadActivities).values({
                    type: "score_change",
                    description: `Score changed from ${current.score} to ${data.score}`,
                    metadata: { from: current.score, to: data.score },
                    leadId: id,
                    userId: ctx.user.id,
                });
            }

            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(leads).where(eq(leads.id, input.id));
            return { success: true };
        }),

    updateStatus: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            status: z.enum(["new", "qualified", "proposal", "negotiation", "won", "lost"]),
        }))
        .mutation(async ({ ctx, input }) => {
            const [current] = await ctx.db
                .select({ status: leads.status })
                .from(leads)
                .where(eq(leads.id, input.id))
                .limit(1);

            const [updated] = await ctx.db
                .update(leads)
                .set({ status: input.status, updatedAt: new Date() })
                .where(eq(leads.id, input.id))
                .returning();

            await ctx.db.insert(leadActivities).values({
                type: "status_change",
                description: `Status changed from ${current?.status ?? "unknown"} to ${input.status}`,
                metadata: { from: current?.status, to: input.status },
                leadId: input.id,
                userId: ctx.user.id,
            });

            // Trigger automation
            await workflowEngine.trigger("lead_status_changed", {
                leadId: input.id,
                oldStatus: current?.status ?? "new",
                newStatus: input.status,
                userId: ctx.user.id,
            });

            return updated;
        }),

    assignTo: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            assignedToId: z.string().uuid().nullable(),
        }))
        .mutation(async ({ ctx, input }) => {
            const [updated] = await ctx.db
                .update(leads)
                .set({
                    assignedToId: input.assignedToId,
                    updatedAt: new Date(),
                })
                .where(eq(leads.id, input.id))
                .returning();
            return updated;
        }),

    addTag: protectedProcedure
        .input(z.object({
            leadId: z.string().uuid(),
            tagId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .insert(leadsToTags)
                .values({ leadId: input.leadId, tagId: input.tagId })
                .onConflictDoNothing();
            return { success: true };
        }),

    removeTag: protectedProcedure
        .input(z.object({
            leadId: z.string().uuid(),
            tagId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .delete(leadsToTags)
                .where(
                    and(
                        eq(leadsToTags.leadId, input.leadId),
                        eq(leadsToTags.tagId, input.tagId),
                    )
                );
            return { success: true };
        }),

    search: protectedProcedure
        .input(z.object({ query: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const q = `%${input.query}%`;
            return ctx.db
                .select()
                .from(leads)
                .where(
                    or(
                        ilike(leads.email, q),
                        ilike(leads.firstName, q),
                        ilike(leads.lastName, q),
                        ilike(leads.company, q),
                        ilike(leads.phone, q),
                    )
                )
                .orderBy(desc(leads.createdAt))
                .limit(20);
        }),

    stats: protectedProcedure.query(async ({ ctx }) => {
        const result = await ctx.db
            .select({
                status: leads.status,
                count: sql<number>`count(*)`,
            })
            .from(leads)
            .groupBy(leads.status);

        const total = result.reduce((sum, r) => sum + Number(r.count), 0);
        const byStatus = Object.fromEntries(result.map((r) => [r.status, Number(r.count)]));

        return { total, byStatus };
    }),
});
