import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    email: text().notNull().unique(),
    name: text(),
    passwordHash: text().notNull(),
    username: text().notNull().unique(),
  },
  (table) => [uniqueIndex("login_idx").on(table.username)],
);

export const assets = sqliteTable("assets", {
  id: integer().primaryKey({ autoIncrement: true }),
  hash: text().notNull(),
  name: text().notNull(),
  userId: integer()
    .notNull()
    .references(() => users.id),
});
