import { pgTable, text, timestamp, uuid, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const contentTypeEnum = pgEnum("content_type", [
    "page",
    "post",
    "case_study",
]);

export const contentStatusEnum = pgEnum("content_status", [
    "draft",
    "published",
    "archived",
]);

export const content = pgTable("content", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    type: contentTypeEnum("type").notNull(),
    status: contentStatusEnum("status").default("draft").notNull(),
    excerpt: text("excerpt"),
    body: text("body"),
    featuredImage: text("featured_image"),
    metadata: jsonb("metadata"),
    authorId: uuid("author_id").references(() => users.id, {
        onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const contentRelations = relations(content, ({ one }) => ({
    author: one(users, {
        fields: [content.authorId],
        references: [users.id],
    }),
}));
