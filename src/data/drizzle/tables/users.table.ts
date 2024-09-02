import { sqliteTable, text, integer, numeric, real } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
   key: integer('key').primaryKey({ autoIncrement: true }),
   username: text('username').notNull().unique(),
   password: text('password').notNull(),
   role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
})