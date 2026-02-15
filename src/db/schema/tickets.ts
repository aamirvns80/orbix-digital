import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { companies } from "./companies";
import { users } from "./users";

export const ticketStatusEnum = pgEnum("ticket_status", [
    "open",
    "in_progress",
    "resolved",
    "closed",
]);

export const ticketPriorityEnum = pgEnum("ticket_priority", [
    "low",
    "medium",
    "high",
    "urgent",
]);

export const tickets = pgTable("tickets", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: ticketStatusEnum("status").default("open").notNull(),
    priority: ticketPriorityEnum("priority").default("medium").notNull(),
    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id, { onDelete: "cascade" }),
    requesterId: uuid("requester_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    assignedToId: uuid("assigned_to_id").references(() => users.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const ticketsRelations = relations(tickets, ({ one }) => ({
    company: one(companies, {
        fields: [tickets.companyId],
        references: [companies.id],
    }),
    requester: one(users, {
        fields: [tickets.requesterId],
        references: [users.id],
        relationName: "ticketRequester",
    }),
    assignedTo: one(users, {
        fields: [tickets.assignedToId],
        references: [users.id],
        relationName: "ticketAssignee",
    }),
}));
