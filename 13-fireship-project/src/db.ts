import { encodeBase64, encodeBase64Url, encodeHex } from "jsr:@std/encoding";
import { crypto } from "jsr:@std/crypto/crypto";

export async function generateShortCode(longUrl: string) {
  try {
    // Se valida la URL con web api
    new URL(longUrl);
  } catch (error) {
    console.log(error);
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
  const res = await kv.set(shortLinkKey, data);

  if (!res.ok) {
    // Handle
  }

  return res;
}

export async function getShortLink(shortCode: string) {
  const link = await kv.get<ShortLink>(["shortlinks", shortCode]);
  return link.value;
}

// Temporary example to try it out
// deno run -A --unstable-kv src/db.ts
const longUrl = "https://fireship.io";
const shortCode = await generateShortCode(longUrl);
const userId = "test";

console.log(shortCode);

const res = await storeShortLink(longUrl, shortCode, userId);
console.log("Value given by kv:", res);

const linkData = await getShortLink(shortCode);
console.log(linkData);
