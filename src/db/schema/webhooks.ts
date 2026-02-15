import { pgTable, text, timestamp, uuid, boolean, jsonb } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const webhooks = pgTable("webhooks", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
    url: text("url").notNull(),
    events: jsonb("events").$type<string[]>().notNull(), // e.g. ["lead.created", "invoice.paid"]
    secret: text("secret").notNull(), // HMCA secret
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
