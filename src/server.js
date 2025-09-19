import { env } from "./env.js";
import { buildApp } from "./app.js";

const app = buildApp();
app.listen(env.port);
