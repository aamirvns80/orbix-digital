import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { companies } from "./companies";

export const contactStatusEnum = pgEnum("contact_status", [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "won",
    "lost",
]);

export const contacts = pgTable("contacts", {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    title: text("title"),
    status: contactStatusEnum("status").default("new").notNull(),
    source: text("source"),
    notes: text("notes"),
    companyId: uuid("company_id").references(() => companies.id, {
        onDelete: "set null",
    }),
    assignedToId: uuid("assigned_to_id").references(() => users.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const contactsRelations = relations(contacts, ({ one }) => ({
    company: one(companies, {
        fields: [contacts.companyId],
        references: [companies.id],
    }),
    assignedTo: one(users, {
        fields: [contacts.assignedToId],
        references: [users.id],
    }),
}));
