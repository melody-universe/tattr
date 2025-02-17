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
    login: text().notNull().unique(),
    name: text(),
    passwordHash: text().notNull(),
  },
  (table) => [uniqueIndex("login_idx").on(table.login)],
);
