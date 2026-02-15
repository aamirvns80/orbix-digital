import { pgTable, text, timestamp, uuid, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leads } from "./leads";
import { users } from "./users";

export const leadActivityTypeEnum = pgEnum("lead_activity_type", [
    "email_open",
    "email_click",
    "form_submit",
    "page_visit",
    "call",
    "meeting",
    "note",
    "status_change",
    "score_change",
]);

export const leadActivities = pgTable("lead_activities", {
    id: uuid("id").defaultRandom().primaryKey(),
    type: leadActivityTypeEnum("type").notNull(),
    description: text("description"),
    metadata: jsonb("metadata"),
    leadId: uuid("lead_id")
        .notNull()
        .references(() => leads.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
    lead: one(leads, {
        fields: [leadActivities.leadId],
        references: [leads.id],
    }),
    user: one(users, {
        fields: [leadActivities.userId],
        references: [users.id],
    }),
}));
