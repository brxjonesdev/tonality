import {
  pgEnum,
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * Enums
 */
export const review_type = pgEnum("review_type", ["album", "track"]);
export const crate_submission_status = pgEnum("crate_submission_status", [
  "pending",
  "accepted",
  "rejected",
]);

/**
 * Reviews table
 */
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(), // string id (UUID or other)
  userId: text("user_id").notNull(),
  itemId: text("item_id").notNull(),
  artistID: text("artist_id").notNull(),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"), // optional
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  edited: boolean("edited").notNull().default(false),
  type: review_type("type").notNull(),
});

/**
 * Crates table
 */
export const crates = pgTable("crates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image"), // optional
  // store tags as jsonb array of strings
  tags: jsonb("tags").$type<string[]>().notNull(),
  creatorId: text("creator_id").notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

/**
 * Crate submissions
 */
export const crate_submissions = pgTable("crate_submissions", {
  id: text("id").primaryKey(),
  fromID: text("from_id").notNull(),
  trackId: text("track_id").notNull(),
  crateID: text("crate_id").notNull(),
  status: crate_submission_status("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  message: text("message"),
});

/**
 * Crate collaborators
 */
export const crate_collaborators = pgTable("crate_collaborators", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  crateId: text("crate_id").notNull(),
});

/**
 * Crate tracks (tracks in a crate with ordering)
 */
export const crate_tracks = pgTable("crate_tracks", {
  id: text("id").primaryKey(),
  crateId: text("crate_id").notNull(),
  trackId: text("track_id").notNull(),
  order: integer("order").notNull().default(0),
});
