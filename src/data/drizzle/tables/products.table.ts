import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const productsTable = sqliteTable("products", {
   key: integer('key').primaryKey({ autoIncrement: true }),
   subcategoryKey: integer('subcategory_key'),
   sku: text('sku'),
   name: text('name'),
   description: text('description'),
   color: text('color'),
   size: text('size'),
   style: text('style'),
   cost: real('cost'),
   price: real('price'),
})