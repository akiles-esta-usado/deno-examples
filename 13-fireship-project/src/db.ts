import { encodeBase64, encodeBase64Url, encodeHex } from "jsr:@std/encoding";
import { crypto } from "jsr:@std/crypto/crypto";

export async function generateShortCode(longUrl: string) {
  try {
    // Se valida la URL con web api
    new URL(longUrl);
  } catch (error) {
    console.log("Error:", error);
    throw new Error("Invalid URL provided");
  }

  const urlData = new TextEncoder().encode(longUrl + Date.now());

  // Retorna un array buffer, hay que codificarlo
  const hash = await crypto.subtle.digest("SHA-256", urlData);
  const shortCode = encodeBase64Url(hash.slice(0, 8)); // 6 bits per character

  return shortCode;
}

/**
 * Deno KV es una base de datos llave-valor embebida en el runtime
 *
 * Similar a redis, soporta transacciones ACID (Atómica, Consistente, Aislada y Durable)
 * Puede ser distribuida globalmente
 *
 * Soporta estructuras nativas de javascript y typescript.
 * No requiere hacer conversiones de datos
 *
 * Localmente ocupa Sqlite, en producción ocupa FoundationDB (kv de apple)
 *
 * Es una base de datos no relacional
 * Modelar algunas estructuras es complicado.
 *
 * KV es la forma más sencilla de empezar a prototipar
 */

const kv = await Deno.openKv();

export type ShortLink = {
  shortCode: string;
  longUrl: string;
  createdAt: number;
  userId: string;
  // Analytics
  clickCount: number;
  lastClickEvent?: string;
};

/**
 * Esta función almacena dos registros:
 * - Vínculo entre shortcode y los datos tipo ShortLink
 * - Vínculo entre un usuario y su shortCode
 */
export async function storeShortLink(
  longUrl: string,
  shortCode: string,
  userId: string,
) {
  const shortLinkKey = ["shortlinks", shortCode];

  const data: ShortLink = {
    shortCode,
    longUrl,
    userId,
    createdAt: Date.now(),
    clickCount: 0,
  };

  // KvKey can be any object??
  // const res = await kv.set(shortLinkKey, data);

  /**
   * Identificador de usuario
   *
   * Requiere ingresar un segundo par llave-valor que vincule
   * al usuario y el shortcode
   *
   * Se necesita que ambos pares llave-valor se almacenen de forma
   * atómica
   */

  const userKey = [userId, shortCode];
  const res = await kv.atomic()
    .set(shortLinkKey, data)
    .set(userKey, shortCode)
    .commit();

  if (!res.ok) {
    // Handle
  }

  return res;
}

/**
 * Retorna un solo link según el shortcode
 */
export async function getShortLink(shortCode: string) {
  const link = await kv.get<ShortLink>(["shortlinks", shortCode]);
  return link.value;
}

/**
 * Retorna todos los links registrados
 *
 * Todas las llaves tienen prefijo "shortlinks"
 *
 * Retornar los datos por usuario es complicado al KV ser nosql
 * Es decir, no se puede hacer `WHERE user == app.user`
 */
export async function getAllLinks() {
  // lv list retorna un lazy list iterator
  // Se recorre con un for await o generando un arreglo
  const list = kv.list<ShortLink>({ prefix: ["shortlinks"] });
  const res = await Array.fromAsync(list);
  const linkValues = res.map((v) => v.value);
  return linkValues;
}

/**
 * Retorna los links generados por un usuario específico
 *
 * 1. Generar iterador de shortcodes por usuario, se convierten
 *    al formato de llave de shortcode ("shortlinks", shortCode)
 *
 * 2. Obtener todos los registros según las llaves
 *
 * 3. Retorna solo los valores, no las llaves
 */
export async function getUserLinks(userId: string) {
  const list = kv.list<string>({ prefix: [userId] });
  const res = await Array.fromAsync(list);
  const userShortLinkKeys = res.map((v) => ["shortlinks", v.value]);

  const userRes = await kv.getMany<ShortLink[]>(userShortLinkKeys);
  const userShortLinks = await Array.fromAsync(userRes);

  return userShortLinks.map((v) => v.value);
}

if (import.meta.main) {
  // Temporary example to try it out
  // deno run -A --unstable-kv src/db.ts
  const longUrl = "https://fireship.io";
  const shortCode = await generateShortCode(longUrl);
  const userId = "test";

  console.log("shortCode:", shortCode);

  const res = await storeShortLink(longUrl, shortCode, userId);
  console.log("Value given by kv:", res);

  const linkData = await getShortLink(shortCode);
  console.log("linkData:", linkData);
}

/**
 * Implementación de autenticación de usuario con Github
 *
 * Oauth 2.0 es un protocolo que permite validar identidad
 * a través de un tercero, como GitHub, Google, Facebook.
 *
 * Luego de que el usuario se autentique, tendremos un
 *
 * Access Token: Usado para tener datos del perfil
 * Session Id: Cookie del servidor para identificar la sesión del browser
 *
 * 1. Setear variables de entorno
 * Son llaves de API para utilizar github como intermediario
 * Con una cuenta GitHub, crear una nueva app
 */

/**
 * User model inside the database and two methods to store and retrieve it
 */
export type GitHubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
};

/**
 * Logged users will have a "sessionId"
 * The sessionId should be associated with sessionData (username, avatar, etc)
 */
export async function storeUser(sessionId: string, userData: GitHubUser) {
  const key = ["sessions", sessionId];
  const res = await kv.set(key, userData);
  return res;
}

export async function getUser(sessionId: string) {
  const key = ["sessions", sessionId];
  const res = await kv.get<GitHubUser>(key);
  return res.value;
}

type ClickAnalytics = {
  ipAddress: string;
  userAgent: string;
  country: string;
};

/**
 * Almacenando estadísticas de los shortcodes
 *
 * Procedimiento:
 *
 * 1. Obtiene el registro de shortLink
 * 2. Crea un registro de analíticas
 * 3. Actualiza el click counter
 *
 * Todo debe ocurrir en una transacción atómica
 */
export async function incrementClickCount(
  shortCode: string,
  data?: Partial<ClickAnalytics>,
) {
  // 1. Obtener registro de shortLink
  const shortLinkKey = ["shortlinks", shortCode];
  const shortLink = await kv.get(shortLinkKey);
  const shortLinkData = shortLink.value as ShortLink;

  /**
   * 2. Crea un registro de analíticas
   * Las analíticas se registran con cada click
   * No se actualizan, siempre se crean registros
   */
  const newClickCount = shortLinkData?.clickCount + 1;
  const analyticsKey = ["analytics", shortCode, newClickCount];
  const analyticsData = {
    shortCode,
    createdAt: Date.now(),
    ...data,
  };

  /**
   * Transacción atómica para actualizar datos de ShortLink y Analytics
   * check: verifica el registro para que el version timestamp de kv coincida con el actual
   * O sino podría quedar desincronizado
   *
   * Qué pasa si shortLink no está sincronizado? Como se gestiona eso?
   * Seguramente va en el Error, se debería indicar de alguna manera
   */
  const res = await kv.atomic()
    .check(shortLink)
    .set(shortLinkKey, {
      ...shortLinkData,
      clickCount: shortLinkData?.clickCount + 1,
    })
    .set(analyticsKey, analyticsData)
    .commit();

  if (!res.ok) {
    console.error("Error recording click!");
  }

  return res;
}

export function watchShortLink(shortCode: string) {
  const shortLinkKey = ["shortlinks", shortCode];
  return kv.watch([shortLinkKey]).getReader();
}

export async function getClickEvent(shortCode: string, clickId: number) {
  const analytics = await kv.get<ClickAnalytics>([
    "analytics",
    shortCode,
    clickId,
  ]);
  return analytics.value;
}
