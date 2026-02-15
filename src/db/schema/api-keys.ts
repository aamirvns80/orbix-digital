import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const apiKeys = pgTable("api_keys", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
    key: text("key").notNull(), // Hashed in real app, but for this MVP we might store plain or simple hash
    prefix: text("prefix").notNull(), // To show "sk_live_123..."
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
