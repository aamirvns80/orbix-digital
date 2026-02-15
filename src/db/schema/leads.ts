import { pgTable, text, timestamp, uuid, pgEnum, jsonb, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { companies } from "./companies";
import { leadActivities } from "./lead-activities";
import { leadNotes } from "./lead-notes";
import { leadsToTags } from "./tags";

export const leadStatusEnum = pgEnum("lead_status", [
    "new",
    "qualified",
    "proposal",
    "negotiation",
    "won",
    "lost",
]);

export const leads = pgTable("leads", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    company: text("company"),
    phone: text("phone"),
    website: text("website"),
    serviceInterest: jsonb("service_interest").$type<string[]>().default([]),
    budget: text("budget"),
    timeline: text("timeline"),
    source: text("source").notNull().default("direct"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    status: leadStatusEnum("status").default("new").notNull(),
    score: integer("score").default(0).notNull(),
    lastContactAt: timestamp("last_contact_at", { mode: "date" }),
    assignedToId: uuid("assigned_to_id").references(() => users.id, {
        onDelete: "set null",
    }),
    companyId: uuid("company_id").references(() => companies.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const leadsRelations = relations(leads, ({ one, many }) => ({
    assignedTo: one(users, {
        fields: [leads.assignedToId],
        references: [users.id],
    }),
    company: one(companies, {
        fields: [leads.companyId],
        references: [companies.id],
    }),
    activities: many(leadActivities),
    notes: many(leadNotes),
    leadsToTags: many(leadsToTags),
}));
