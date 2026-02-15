import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";

export const testimonials = pgTable("testimonials", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    title: text("title").notNull(),
    company: text("company").notNull(),
    avatar: text("avatar"),
    quote: text("quote").notNull(),
    rating: integer("rating").default(5).notNull(),
    featured: boolean("featured").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
