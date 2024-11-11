import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { requestId } from "hono/request-id";
import chalk from "chalk";

type Bindings = {
  ORIGIN_HOST: string;
  PORT: number;
};

const originApp = new Hono({});
originApp.use(async (c, next) => {
  const reqId = c.req.header("requestId").slice(-6);
  const color = chalk.hex(`#${reqId}`);

  console.log(color(reqId, "origin Request", "<--", c.req.method, c.req.path));
  const ctx = await next();
  console.log(color(reqId, "origin Response", "-->", ctx.res.status));
});
originApp.all(async (c) => {
  const { ORIGIN_BASE_URL } = env(c);
  const url = new URL(ORIGIN_BASE_URL);
  url.pathname = c.req.path;
  return fetch(url);
});
originApp.onError(async (err, c) => {
  console.error("origin Error", err.message, err.stack);
  return c.json({ error: "origin error: " + err.message }, 500);
});

const app = new Hono<{ Bindings: Bindings }>();
app.use(requestId());
app.use(async (c, next) => {
  // last 6
  const reqId = c.get("requestId").slice(-6);
  const color = chalk.hex(`#${reqId}`);

  console.log(color(reqId, "viewer Request", "<--", c.req.method, c.req.path));
  const ctx = await next();
  console.log(color(reqId, "viewer Response", "-->", ctx.res.status));
});
app.all(async (c) => {
  const url = new URL(c.req.raw.url);
  // console.log("url", url);
  const method = c.req.raw.method;
  const originRequest = new Request(url, {
    method: method,
    headers: {
      ...c.req.header(),
      requestId: c.get("requestId"),
    },
  });

  const originResponse = await originApp.fetch(originRequest);
  return originResponse;
});
app.onError(async (err, c) => {
  console.error("viewer Error", err.message);
  return c.json({ error: err.message }, 500);
});

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  process.exit(0);
});
