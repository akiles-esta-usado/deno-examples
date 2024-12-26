/**
 * Manejo específico de la autenticación oauth
 *
 * Deno KV OAuth: https://github.com/denoland/deno_kv_oauth
 *
 * create...OAuthConfig: Lee env, extrae ID y SECRET
 * proveedor (GitHub, Google, Facebook)
 *
 * createHelpers usa la config para crear un par de funciones
 * - handleCallback
 * - getSessionId
 *
 * Indica si usuario está logeado
 */
import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import { pick } from "jsr:@std/collections/pick";
import { getUser, type GitHubUser, storeUser } from "./db.ts";

// Esto lee el env para crear la configuración
// Con esa configuración se crean funciones handle, que son closures
const oauthConfig = createGitHubOAuthConfig();
const {
  handleCallback,
  getSessionId,
} = createHelpers(oauthConfig);

/**
 * SessionID sirve para
 * - Indicar si un usuario está loggeado
 * - Sirve para obtener datos de KV
 */

export async function getCurrentUser(req: Request) {
  const sessionId = await getSessionId(req);
  console.log(sessionId);
  return sessionId ? await getUser(sessionId) : null;
}

/**
 * Los detalles de la cuenta se obtienen desde la API de github
 *
 * accessToken es un valor que se obtiene cuando el usuario se autentica
 * No es persistente, no se almacena en base de datos
 * Revisar handleGithubCallback
 */
export async function getGitHubProfile(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    response.body?.cancel();
    throw new Error("Failed to fetch GitHub user");
  }

  return response.json() as Promise<GitHubUser>;
}

/**
 * Contexto: Usuario acaba de autenticarse en github
 * Gatillante: Github redirige con request de éxito
 * Proceso:
 * 1. Se obtiene la información del callback OAuth
 * 2. Se obtienen datos del usuario
 * 3. Se almacenan datos de interés (pick) en kv
 * 4. Se retorna la respuesta OAuth
 *
 * req: Callback request generado en el proceso de OAuth.
 */
export async function handleGitHubCallback(req: Request) {
  /**
   * Se asume que esto funcionó correctamente.
   *
   * response:  Redirección al URL exitoso.
   * tokens:    Información del token como tipo (Bearer), expiración, alcance
   * sessionId: string
   */
  const { response, tokens, sessionId } = await handleCallback(req);
  const userData = await getGitHubProfile(tokens?.accessToken);

  const filteredData = pick(userData, ["avatar_url", "html_url", "login"]);
  await storeUser(sessionId, filteredData);
  return response;
}
