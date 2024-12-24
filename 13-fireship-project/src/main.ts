import { serveDir } from "@std/http";

/**
 * No se crea una lista de rutas, sino que se generan patrones y en el handler
 * se gestiona la lógica.
 *
 * Seguramente la perspectiva anterior también era complicada, o podía llevar a
 * confusiones
 *
 * Acá es todo explícito y secuencial.
 */
const userPagePattern = new URLPattern({ pathname: "/users/:id" });
const staticPathPattern = new URLPattern({ pathname: "/static/*" });

/**
 * A diferencia del otro código, no se define un defaultHandler, sino que
 * se anota explícitamente
 */
export default {
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response("Home page");
    }

    const userPageMatch = userPagePattern.exec(url);
    if (userPageMatch) {
      return new Response(userPageMatch.pathname.groups.id);
    }

    if (staticPathPattern.test(url)) {
      return serveDir(req);
    }

    // equivale a defaultHandler
    return new Response("Not found", { status: 404 });
  },
} satisfies Deno.ServeDefaultExport;
