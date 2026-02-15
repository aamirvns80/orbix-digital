import { pgTable, text, timestamp, decimal, uuid, date } from "drizzle-orm/pg-core";
import { leads } from "./leads";

export const proposalStatusEnum = pgTable("proposal_status_enum", {}).$inferSelect;

export const proposals = pgTable("proposals", {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }).notNull(),
    title: text("title").notNull(),
    content: text("content"), // Summary or intro text
    status: text("status", { enum: ["draft", "sent", "accepted", "rejected", "expired"] }).default("draft").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).default("0").notNull(),
    token: text("token").unique().notNull(), // For public access
    validUntil: date("valid_until"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
