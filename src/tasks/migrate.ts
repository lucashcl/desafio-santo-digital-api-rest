import papaparse from "papaparse"
import fs from "node:fs/promises"
import { db } from "../data/drizzle/db"
import { productsTable } from "../data/drizzle/tables/products.table"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { usersTable } from "../data/drizzle/tables/users.table"
import bcrypt from "bcrypt"

const productsCsv = await fs.readFile("src/data/AdventureWorks_Products.csv", "utf-8")

type Product = {
   ProductKey: string
   ProductSubcategoryKey: string
   ProductSKU: string
   ProductName: string
   ModelName: string
   ProductDescription: string
   ProductColor: string
   ProductSize: string
   ProductStyle: string
   ProductCost: string
   ProductPrice: string
}

export const { data: products, errors } = papaparse.parse<Product>(productsCsv.trim(), { header: true })
if (errors.length) {
   console.error(errors)
}

migrate(db, { migrationsFolder: 'src/data/drizzle/migrations' });

await db.insert(productsTable).values(products.map(product => ({
   key: +product.ProductKey,
   subcategoryKey: +product.ProductSubcategoryKey,
   sku: product.ProductSKU,
   name: product.ProductName,
   description: product.ProductDescription,
   color: product.ProductColor,
   size: product.ProductSize,
   style: product.ProductStyle,
   cost: +product.ProductCost,
   price: +product.ProductPrice,
})))

await db.insert(usersTable).values({
   username: "admin",
   password: bcrypt.hashSync("password", 10),
   role: "admin"
})
