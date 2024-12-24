import { Handler, type Route, route } from "jsr:@std/http/unstable-route";

/**
 * Explicación de express (La inspiración de este router)
 *
 * Se instancia una clase router
 * El objeto tiene métodos para agregar rutas según el método http
 * Argumentos de cada método:
 * - La ruta como string
 * - Una función callback que toma el request y retorna un response
 *
 * Una ventaja importante es poner middleware, por ejemplo autenticación
 * para ciertas rutas
 */

export class Router {
  // El uso de # es un alias de private
  #routes: Route[] = [];

  /**
   * En Express existe un método `serve`
   * En Deno, eso se gestiona en main, en el default export
   *
   * Se creará un método get que retorne el handler
   */

  handler() {
    return route(
      this.#routes,
      () => new Response("Not found", { status: 404 }),
    );
  }

  /**
   * method: HTTP Verb (GET, POST, DELETE, etc)
   * path: URL
   * handler: Function to execute when called
   */
  #addRoute(method: string, path: string, handler: Handler) {
    const pattern = new URLPattern({ pathname: path });

    /**
     * El handler tiene algo de lógica de control por si ocurre algún error
     */
    this.#routes.push({
      pattern,
      method,
      handler: async (req, params, info) => {
        try {
          return await handler(req, params!, info!);
        } catch (error) {
          console.error("Error handling request:", error);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    });
  }

  /**
   * Con addRoute se pueden agregar los métodos
   */

  get(path: string, handler: Handler) {
    this.#addRoute("GET", path, handler);
  }

  post(path: string, handler: Handler) {
    this.#addRoute("POST", path, handler);
  }

  put(path: string, handler: Handler) {
    this.#addRoute("PUT", path, handler);
  }

  delete(path: string, handler: Handler) {
    this.#addRoute("DELETE", path, handler);
  }
}
