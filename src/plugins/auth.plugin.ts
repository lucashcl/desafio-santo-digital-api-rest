import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

const jwtInstance = jwt({
   name: "jwt",
   secret: process.env.JWT_SECRET ?? "secret"
})

export const auth = new Elysia({
   name: "auth"
})
   .use(jwtInstance)
   .use(bearer())
   .resolve(async ({ error, bearer, jwt }) => {
      if (!bearer) {
         return error(401, "Unauthorized")
      }

      const value = await jwt.verify(bearer)
      if (!value) {
         return error(401, "Unauthorized")
      }

      return { user: value }
   })
   .as('plugin')