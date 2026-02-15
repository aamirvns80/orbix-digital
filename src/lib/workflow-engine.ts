import { db } from "@/db";
import { automations, notifications, webhooks } from "@/db/schema";
import { eq } from "drizzle-orm";

type EventType = "lead_status_changed" | "ticket_created" | "lead_created";

interface EventPayload {
    lead_status_changed: { leadId: string; oldStatus: string; newStatus: string; userId?: string };
    ticket_created: { ticketId: string; title: string; priority: string; createdBy: string };
    lead_created: { leadId: string; name: string; source: string };
}

export const workflowEngine = {
    async trigger<T extends EventType>(event: T, payload: EventPayload[T]) {
        console.log(`[WorkflowEngine] Triggered: ${event}`, payload);

        // 1. Run Internal Automations
        try {
            // Fetch enabled automations for this trigger
            // In a real app, we'd filter by companyId too. For now, we fetch all global matches.
            const activeAutomations = await db.query.automations.findMany({
                where: (table, { eq, and }) => and(
                    eq(table.triggerType, event),
                    eq(table.isEnabled, true)
                ),
            });

            if (activeAutomations.length > 0) {
                console.log(`[WorkflowEngine] Found ${activeAutomations.length} internal automations for ${event}`);
                // 2. Execute actions
                for (const automation of activeAutomations) {
                    await this.executeAction(automation, payload);
                }
            }
        } catch (error) {
            console.error("[WorkflowEngine] Automation Error:", error);
        }

        // 2. Dispatch Webhooks
        try {
            // We need companyId to find relevant webhooks.
            // Payload usually has userId, leadId, etc. We need to resolve companyId.
            // For MVP, we will dispatch to ALL webhooks that match the event (since we are single-tenant-ish or dev mode)
            // In production, MUST filter by companyId derived from payload.

            // Drizzle JSON array overlap is tricky, so fetching all active webhooks and filtering in memory for MVP simplicity
            const activeWebhooks = await db.query.webhooks.findMany({
                where: eq(webhooks.isActive, true),
            });

            const matchingWebhooks = activeWebhooks.filter(wh =>
                (wh.events as string[]).includes(event) || (wh.events as string[]).includes("*")
            );

            if (matchingWebhooks.length > 0) {
                console.log(`[WorkflowEngine] Found ${matchingWebhooks.length} webhooks for ${event}`);

                const timestamp = new Date().toISOString();
                const signature = "sha256=..."; // Compute HMAC if secret exists

                await Promise.all(matchingWebhooks.map(async (wh) => {
                    try {
                        await fetch(wh.url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-Agency-Event": event,
                                "X-Agency-Timestamp": timestamp,
                                // "X-Agency-Signature": signature,
                            },
                            body: JSON.stringify({
                                id: crypto.randomUUID(),
                                event: event,
                                timestamp: timestamp,
                                payload: payload,
                            }),
                        });
                        console.log(`[WorkflowEngine] Webhook sent to ${wh.url}`);
                    } catch (err) {
                        console.error(`[WorkflowEngine] Webhook failed for ${wh.url}`, err);
                    }
                }));
            }

        } catch (error) {
            console.error("[WorkflowEngine] Webhook Dispatch Error:", error);
        }
    },

    async executeAction(automation: typeof automations.$inferSelect, payload: any) {
        try {
            switch (automation.actionType) {
                case "create_notification":
                    // Simple logic to determine recipient (e.g., all admins or specific user)
                    // For MVP, we'll notify the 'admin' user or the user involved if possible
                    // mocking a generic "admin" ID or fetching real admins would be better
                    const adminUser = await db.query.users.findFirst({
                        where: (users, { eq }) => eq(users.role, "admin"),
                    });

                    if (adminUser) {
                        await db.insert(notifications).values({
                            userId: adminUser.id,
                            title: `Automation: ${automation.name}`,
                            message: JSON.stringify(payload), // Simplified message
                            type: "info",
                        });
                    }
                    break;

                case "send_email":
                    console.log(`[MockEmail] Sending email for ${automation.name}`);
                    break;
            }
        } catch (error) {
            console.error(`[WorkflowEngine] Action failed: ${error}`);
        }
    }
};
