import { pgTable, text, timestamp, decimal, uuid, date } from "drizzle-orm/pg-core";
import { leads } from "./leads";
import { proposals } from "./proposals";

export const invoices = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }).notNull(),
    proposalId: uuid("proposal_id").references(() => proposals.id, { onDelete: "set null" }),
    number: text("number").notNull(), // e.g. INV-001
    status: text("status", { enum: ["draft", "pending", "paid", "overdue", "cancelled"] }).default("draft").notNull(),
    issueDate: date("issue_date").notNull(),
    dueDate: date("due_date").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).default("0").notNull(),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0").notNull(),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).default("0").notNull(),
    notes: text("notes"),
    token: text("token").unique().notNull(), // For public access
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
