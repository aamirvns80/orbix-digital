import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { contacts } from "./contacts";

export const companies = pgTable("companies", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    website: text("website"),
    industry: text("industry"),
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
    notes: text("notes"),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
import { leads } from "./leads";

export const companiesRelations = relations(companies, ({ many }) => ({
    contacts: many(contacts),
    leads: many(leads),
}));
