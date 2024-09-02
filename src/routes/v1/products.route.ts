import Elysia, { t } from "elysia";
import { db } from "../../data/drizzle/db";
import { productsTable } from "../../data/drizzle/tables/products.table";
import { eq } from "drizzle-orm";
import { auth } from "../../plugins/auth.plugin";

export const productsRoute = new Elysia({ prefix: "/products" })
   .use(auth)
   .get("/", async ({ query: { page, pageSize } }) => {
      const products = await db
         .select()
         .from(productsTable)
         .orderBy(productsTable.key)
         .limit(pageSize)
         .offset((page - 1) * pageSize)
      return { data: products, page, pageSize }
   }, {
      query: t.Object({
         page: t.Number({ default: 1 }),
         pageSize: t.Number({ default: 10 }),
      })
   })
   .get("/:id", async ({ params: { id }, error }) => {
      const [product] = await db
         .select()
         .from(productsTable)
         .where(eq(productsTable.key, id))
      if (!product) {
         return error(404, "Not found")
      }
      return product
   }, {
      params: t.Object({
         id: t.Number()
      })
   })
   .guard({
      beforeHandle: async ({ user, error }) => {
         console.log(user)
         if (user.role !== "admin") {
            return error(403, "Forbidden")
         }
      }
   }, app =>
      app
         .post("/", ({ body }) => {
            db.transaction(tx => {
               tx.insert(productsTable).values(body)
            })
         }, {
            body: t.Object({
               subcategoryKey: t.Number(),
               sku: t.String(),
               name: t.String(),
               description: t.String(),
               color: t.String(),
               size: t.String(),
               style: t.String(),
               cost: t.Number(),
               price: t.Number(),
            })
         })
         .put("/:id", ({ params: { id }, body }) => {
            db.transaction(tx => {
               tx.update(productsTable).set(body)
            })
         }, {
            params: t.Object({
               id: t.Number()
            }),
            body: t.Object({
               subcategoryKey: t.Number(),
               sku: t.String(),
               name: t.String(),
               description: t.String(),
               color: t.String(),
               size: t.String(),
               style: t.String(),
               cost: t.Number(),
               price: t.Number(),
            })
         })
         .delete("/:id", async ({ params: { id } }) => {
            db.transaction(tx => {
               tx.delete(productsTable).where(eq(productsTable.key, id))
            })
         }, {
            params: t.Object({
               id: t.Number()
            })
         })
   )