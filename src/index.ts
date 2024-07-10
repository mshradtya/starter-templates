import "module-alias/register";
import App from "./app";
import { PORT } from "@/utils/secrets";
import UserController from "./resources/user/user.controller";
import ProductController from "./resources/products/products.controller";

const app = new App(
  [new UserController(), new ProductController()],
  Number(PORT)
);

app.listen();
