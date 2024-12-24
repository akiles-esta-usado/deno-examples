/**
 * Este archivo es el que ocupa fireship. No es el mismo que genera deno init --serve en mi caso.
 */

import { type Route, route } from "jsr:@std/http/unstable-route";
import { serveDir } from "jsr:@std/http";

/**
 * Arreglo de rutas
 *
 * Cada ruta es un objeto que tiene un
 * - url pattern
 * - un handler, función que indica al server que hacer cuando un usuario navega a la ruta
 * Eventualmente el handler retornará json
 */
const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/" }),
    handler: () => new Response("Home page"),
  },
  {
    /**
     * route param. Wildcard que uede ser lo que sea
     * Callback function en el handler.
     * - _req   Datos del request hecho por un usuario
     * - _info  Información de Deno
     * - params Los parámetros de URL
     */
    pattern: new URLPattern({ pathname: "/users/:id" }),
    handler: (_req, _info, params) => new Response(_info?.pathname.groups.id),
    
  },
  {
    /**
     * Enruta a un directorio estático
     * Ahí se almacenan archivos como imágenes, javascript, html.
     * Deno STD tiene la función `serveDir` para enviar todos los archivos y headers correctos
     */
    pattern: new URLPattern({ pathname: "/static/*" }),
    handler: (req) => serveDir(req),
  },
];

function defaultHandler(_req: Request) {
  return new Response("Not found", { status: 404 });
}

/**
 * La función más importante
 * Toma una tabla de rutas
 * Si la solicitud no coincide con ningúna se ejecuta defaultHandler
 */
const handler = route(routes, defaultHandler);

export default {
  fetch(req) {
    return handler(req);
  },
} satisfies Deno.ServeDefaultExport;

/**
 * deno serve main.ts
 *
 * deno task dev
 */
