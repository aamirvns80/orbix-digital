import { pgTable, text, decimal, uuid, integer } from "drizzle-orm/pg-core";
import { invoices } from "./invoices";

export const invoiceItems = pgTable("invoice_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
    description: text("description").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).default("0").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).default("0").notNull(),
});
