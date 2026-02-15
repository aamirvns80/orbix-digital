import { pgTable, text, decimal, uuid, integer } from "drizzle-orm/pg-core";
import { proposals } from "./proposals";

export const proposalItems = pgTable("proposal_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    proposalId: uuid("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
    description: text("description").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).default("0").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).default("0").notNull(),
});
