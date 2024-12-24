// https://www.youtube.com/watch?v=KoM8ahe8O74&t=252s

/**
 * Deno soporta typescript y JSX de forma nativa
 *
 * No se requiere tsnode, tsc o tsconfig para trabajar con typescript
 */

export default function sing(
  phrase: string,
  times: number,
): string {
  return Array(times).fill(phrase).join(" ");
}

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}
