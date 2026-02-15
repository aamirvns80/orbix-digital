import { pgTable, text, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leads } from "./leads";

export const tags = pgTable("tags", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    color: text("color").default("#6366f1"),
});

// Many-to-many junction table
export const leadsToTags = pgTable(
    "leads_to_tags",
    {
        leadId: uuid("lead_id")
            .notNull()
            .references(() => leads.id, { onDelete: "cascade" }),
        tagId: uuid("tag_id")
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (t) => [primaryKey({ columns: [t.leadId, t.tagId] })]
);

export const tagsRelations = relations(tags, ({ many }) => ({
    leadsToTags: many(leadsToTags),
}));

export const leadsToTagsRelations = relations(leadsToTags, ({ one }) => ({
    lead: one(leads, {
        fields: [leadsToTags.leadId],
        references: [leads.id],
    }),
    tag: one(tags, {
        fields: [leadsToTags.tagId],
        references: [tags.id],
    }),
}));
