import Elysia, { t } from "elysia";
import { db } from "../../data/drizzle/db";
import { usersTable } from "../../data/drizzle/tables/users.table";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "@elysiajs/jwt";

export const authRoute = new Elysia({ prefix: "/auth" })
   .use(jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET ?? "secret",
   }))
   .post("/register", async ({ body: { username, password } }) => {
      await db.insert(usersTable).values({
         username: username,
         password: bcrypt.hashSync(password, 10),
      })
   }, {
      body: t.Object({
         username: t.String(),
         password: t.String(),
      })
   })
   .post("/login", async ({ body: { username, password }, set, jwt, cookie: { auth } }) => {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username))
      if (!user) {
         set.status = 404
         return { message: "Username not found" }
      }

      if (!bcrypt.compareSync(password, user.password)) {
         set.status = 401
         return { message: "Incorrect password" }
      }
      const token = await jwt.sign({ username, role: user.role })
      return { token }
   }, {
      body: t.Object({
         username: t.String(),
         password: t.String()
      })
   })