import { defineConfig } from 'drizzle-kit'

export default defineConfig({
   dialect: "sqlite",
   schema: "./src/data/drizzle/tables/*",
   dbCredentials: {
      url: "data.db"
   },
   out: "./src/data/drizzle/migrations",
})