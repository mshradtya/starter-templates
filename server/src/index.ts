import "module-alias/register";
import App from "./app";
import { PORT } from "@/utils/secrets";
import UserController from "./resources/user/user.controller";

const app = new App([new UserController()], Number(PORT));

app.listen();
