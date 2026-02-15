import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leads } from "./leads";
import { users } from "./users";

export const leadNotes = pgTable("lead_notes", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    leadId: uuid("lead_id")
        .notNull()
        .references(() => leads.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
    lead: one(leads, {
        fields: [leadNotes.leadId],
        references: [leads.id],
    }),
    user: one(users, {
        fields: [leadNotes.userId],
        references: [users.id],
    }),
}));
