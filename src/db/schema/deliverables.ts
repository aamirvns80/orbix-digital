import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { companies } from "./companies";

export const deliverableStatusEnum = pgEnum("deliverable_status", [
    "draft",
    "pending_review",
    "approved",
    "changes_requested",
]);

export const deliverables = pgTable("deliverables", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    status: deliverableStatusEnum("status").default("draft").notNull(),
    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id, { onDelete: "cascade" }),
    dueDate: timestamp("due_date", { mode: "date" }),
    docLink: text("doc_link"),
    previewImage: text("preview_image"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const deliverablesRelations = relations(deliverables, ({ one }) => ({
    company: one(companies, {
        fields: [deliverables.companyId],
        references: [companies.id],
    }),
}));
