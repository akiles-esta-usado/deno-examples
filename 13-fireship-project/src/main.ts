import { getShortLink } from "./db.ts";
import { generateShortCode, storeShortLink } from "./db.ts";
import { Router } from "./router.ts";

/**
 * render converts jsx to html
 */
import { render } from "npm:preact-render-to-string";
import { HomePage } from "./ui.tsx";

const app = new Router();

app.get("/", () => {
  return new Response(
    render(HomePage({ user: null })),
    {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    },
  );
});
app.post("/health-check", () => new Response("It's ALIVE!"));

app.post("/links", async (req) => {
  // return new Response(JSON.stringify(await req.json()));
  const { longUrl } = await req.json();
  const shortCode = await generateShortCode(longUrl);
  await storeShortLink(longUrl, shortCode, "testUser");

  return new Response("Success", {
    status: 201,
  });
});

app.get("/links/:shortCode", async (req, params, info) => {
  const shortCode = params?.pathname.groups.shortCode;

  const data = await getShortLink(shortCode!);

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: {
      "content-type": "application/json",
    },
  });
});

export default {
  fetch(req) {
    return app.handler()(req);
  },
} satisfies Deno.ServeDefaultExport;
