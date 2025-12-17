import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
	isAdmin: boolean("is_admin").default(false).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const touristTable = pgTable("tourist", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
	email: text("email").notNull(),
	phone: text("phone").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  passport: text("passport").notNull(),
});

export const documentTemplateTable = pgTable("document_template", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  body: text("body").notNull(),
});

export const customFieldType = ["multiple", "single"] as const;

export const customFieldTable = pgTable("custom_field", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type", { enum: customFieldType }).notNull(),
  documentTemplateId: integer("document_template_id"), //can be null to make it global
});

export const tourTable = pgTable("tour", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => touristTable.id, { onDelete: "cascade" }),
});

export const tour_touristTable = pgTable("tour_tourist", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  tourId: integer("tour_id")
    .notNull()
    .references(() => tourTable.id, { onDelete: "cascade" }),
  touristId: integer("tourist_id")
    .notNull()
    .references(() => touristTable.id, { onDelete: "cascade" }),
});

export const tour_custom_fieldTable = pgTable("tour_custom_field", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  tourId: integer("tour_id")
    .notNull()
    .references(() => tourTable.id, { onDelete: "cascade" }),
  customFieldId: integer("custom_field_id")
    .notNull()
    .references(() => customFieldTable.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
});
