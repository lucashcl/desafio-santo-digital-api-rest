import { Elysia } from "elysia";
import { authRoute } from "./routes/v1/auth.route";
import { productsRoute } from "./routes/v1/products.route";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(productsRoute)
  .use(authRoute)
  .listen(3000);



console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
