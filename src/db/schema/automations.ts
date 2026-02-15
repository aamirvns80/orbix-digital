import { pgTable, text, timestamp, boolean, uuid, jsonb } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const automations = pgTable("automations", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
    triggerType: text("trigger_type").notNull(), // e.g., "lead_status_changed", "ticket_created"
    actionType: text("action_type").notNull(),   // e.g., "send_email", "create_notification"
    config: jsonb("config").default({}).notNull(), // Stores specific settings like email template ID
    isEnabled: boolean("is_enabled").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
