import { getShortLink, getUserLinks, incrementClickCount } from "./db.ts";
import { generateShortCode, storeShortLink } from "./db.ts";
import { Router } from "./router.ts";

/**
 * render converts jsx to html
 */
import { render } from "npm:preact-render-to-string";
import {
  CreateShortlinkPage,
  HomePage,
  LinksPage,
  NotFoundPage,
  ShortlinkViewPage,
  UnauthorizedPage,
} from "./ui.tsx";

/**
 * Oauth 2.0 routes
 */
import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import { handleGitHubCallback } from "./auth.ts";

const app = new Router();

/**
 * El mismo procedimiento de auth.ts pero usando los handles signIn y singOut
 */
const oauthConfig = createGitHubOAuthConfig({
  redirectUri: Deno.env.get("REDIRECT_URI"),
});
const { signIn, signOut } = createHelpers(oauthConfig);

/**
 * Esto sería estándar de oauth con github
 */

app.get("/oauth/signin", (req: Request) => signIn(req));
app.get("/oauth/signout", signOut);
app.get("/oauth/callback", handleGitHubCallback);

app.post("/health-check", () => new Response("It's ALIVE!"));

function unauthorizedResponse() {
  return new Response(render(UnauthorizedPage()), {
    status: 401,
    headers: {
      "content-type": "text/html",
    },
  });
}

/**
 * Links
 * /links
 */

app.get("/links", async () => {
  if (!app.currentUser) return unauthorizedResponse();

  const shortLinks = await getUserLinks(app.currentUser.login);

  return new Response(render(LinksPage({ shortLinkList: shortLinks })), {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});

// app.post("/links", async (req) => {
//   // return new Response(JSON.stringify(await req.json()));
//   const { longUrl } = await req.json();
//   const shortCode = await generateShortCode(longUrl);
//   await storeShortLink(longUrl, shortCode, "testUser");

//   return new Response("Success", {
//     status: 201,
//   });
// });

app.post("/links", async (req) => {
  if (!app.currentUser) return unauthorizedResponse();

  const formData = await req.formData();
  const longUrl = formData.get("longUrl") as string;

  if (!longUrl) {
    return new Response("Missing longUrl", { status: 400 });
  }

  const shortCode = await generateShortCode(longUrl);
  console.log("shortCode:", shortCode);

  await storeShortLink(longUrl, shortCode, app.currentUser.login);

  return new Response(null, {
    status: 303,
    headers: {
      "Location": "/links ",
    },
  });
});

app.get("/links/new", (_req) => {
  if (!app.currentUser) return unauthorizedResponse();

  return new Response(render(CreateShortlinkPage()), {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});

app.get("/links/:shortCode", async (req, params, info) => {
  const shortCode: string = params?.pathname.groups["shortCode"] || "";
  console.log("getting shortCode: ", shortCode);
  const shortLink = await getShortLink(shortCode);

  if (!shortLink) {
    return new Response(render(NotFoundPage({ shortCode })), {
      status: 404,
      headers: {
        "content-type": "text/html",
      },
    });
  }

  return new Response(render(ShortlinkViewPage({ shortLink })), {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});

/**
 * HomePage
 * /
 */

app.get("/", () => {
  return new Response(
    render(HomePage({ user: app.currentUser })),
    {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    },
  );
});

/**
 * Es la forma común de usar el acortador
 * app.com/shortCode
 * Redirige al otro sitio
 */
app.get("/:shortCode", async (req, params, info) => {
  const shortCode: string = params?.pathname.groups["shortCode"] || "";
  console.log("getting shortCode: ", shortCode);
  const shortLink = await getShortLink(shortCode);

  if (!shortLink) {
    return new Response(render(NotFoundPage({ shortCode })), {
      status: 404,
      headers: {
        "content-type": "text/html",
      },
    });
  }

  // Obteniendo datos de analíticas
  const ipAddress = req.headers.get("x-forward-for") ||
    req.headers.get("cf-connecting-ip") || "Unknown";
  const userAgent = req.headers.get("user-agent") || "Unknown";
  const country = req.headers.get("cf-ipcountry") || "Unknown";
  await incrementClickCount(shortCode, {
    ipAddress,
    userAgent,
    country,
  });

  return new Response(null, {
    status: 303,
    headers: {
      "Location": shortLink.longUrl,
    },
  });
});

export default {
  fetch(req) {
    return app.handler()(req);
  },
} satisfies Deno.ServeDefaultExport;
