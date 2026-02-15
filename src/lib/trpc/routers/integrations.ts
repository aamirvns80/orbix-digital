
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../server";
import { apiKeys, webhooks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const integrationsRouter = createTRPCRouter({
    // API Keys
    listApiKeys: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.apiKeys.findMany({
            where: eq(apiKeys.companyId, ctx.user.companyId!),
            orderBy: [desc(apiKeys.createdAt)],
        });
    }),

    createApiKey: protectedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            // Generate a secure looking key
            const key = `sk_live_${Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)}`;
            const prefix = `${key.substring(0, 8)}...`;

            await ctx.db.insert(apiKeys).values({
                companyId: ctx.user.companyId!,
                name: input.name,
                key: key, // In production, hash this! Storing plain for MVP demo.
                prefix: prefix,
            });

            return { key }; // Return full key ONLY once
        }),

    revokeApiKey: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(apiKeys).where(eq(apiKeys.id, input.id));
            return { success: true };
        }),

    // Webhooks
    listWebhooks: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.webhooks.findMany({
            where: eq(webhooks.companyId, ctx.user.companyId!),
            orderBy: [desc(webhooks.createdAt)],
        });
    }),

    createWebhook: protectedProcedure
        .input(z.object({
            url: z.string().url(),
            events: z.array(z.string()),
        }))
        .mutation(async ({ ctx, input }) => {
            const secret = `whsec_${Math.random().toString(36).substring(2)}`;

            await ctx.db.insert(webhooks).values({
                companyId: ctx.user.companyId!,
                url: input.url,
                events: input.events,
                secret: secret,
            });

            return { success: true };
        }),

    deleteWebhook: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(webhooks).where(eq(webhooks.id, input.id));
            return { success: true };
        }),

    testWebhook: protectedProcedure
        .input(z.object({ url: z.string().url() }))
        .mutation(async ({ input }) => {
            // Ping the URL
            try {
                await fetch(input.url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ event: "ping", timestamp: new Date().toISOString() }),
                });
                return { success: true };
            } catch (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Webhook ping failed" });
            }
        }),
});
