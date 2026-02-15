import { createTRPCRouter, protectedProcedure } from "../server";
import { leads } from "@/db/schema/leads";
import { tickets } from "@/db/schema/tickets";
import { companies } from "@/db/schema/companies";
import { leadActivities } from "@/db/schema/lead-activities";
import { sql, eq, and, gte, desc } from "drizzle-orm";

export const analyticsRouter = createTRPCRouter({
    getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
        // Total Leads
        const [leadsCount] = await ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(leads);

        // Active Clients (Companies)
        const [clientsCount] = await ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(companies);

        // Open Tickets
        const [openTicketsCount] = await ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(tickets)
            .where(eq(tickets.status, "open"));

        // Won Leads (Revenue Proxy)
        const [wonLeadsCount] = await ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(leads)
            .where(eq(leads.status, "won"));

        return {
            totalLeads: Number(leadsCount.count),
            activeClients: Number(clientsCount.count),
            openTickets: Number(openTicketsCount.count),
            wonLeads: Number(wonLeadsCount.count),
        };
    }),

    getLeadsOverTime: protectedProcedure.query(async ({ ctx }) => {
        // Last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await ctx.db
            .select({
                date: sql<string>`to_char(${leads.createdAt}, 'YYYY-MM-DD')`,
                count: sql<number>`count(*)`
            })
            .from(leads)
            .where(gte(leads.createdAt, thirtyDaysAgo))
            .groupBy(sql`to_char(${leads.createdAt}, 'YYYY-MM-DD')`)
            .orderBy(sql`to_char(${leads.createdAt}, 'YYYY-MM-DD')`);

        return result.map(r => ({ ...r, count: Number(r.count) }));
    }),

    getPipelineDistribution: protectedProcedure.query(async ({ ctx }) => {
        const result = await ctx.db
            .select({
                status: leads.status,
                count: sql<number>`count(*)`
            })
            .from(leads)
            .groupBy(leads.status);

        return result.map(r => ({ ...r, count: Number(r.count) }));
    }),

    getActivityVolume: protectedProcedure.query(async ({ ctx }) => {
        // Last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await ctx.db
            .select({
                type: leadActivities.type,
                count: sql<number>`count(*)`
            })
            .from(leadActivities)
            .where(gte(leadActivities.createdAt, thirtyDaysAgo))
            .groupBy(leadActivities.type)
            .orderBy(desc(sql`count(*)`))
            .limit(5); // Top 5 activity types

        return result.map(r => ({ ...r, count: Number(r.count) }));
    }),
});
