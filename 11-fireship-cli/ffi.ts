// Es necesario hacer una función en ts que use el código c.

const libName = "lib.so";

// Esta es la interfaz descrita como un objeto

const lib = Deno.dlopen(libName, {
  toUpperCase: {
    parameters: ["pointer"],
    result: "void",
  },
});

// En C, un string es un arreglo de enteros sin signo
// Es necesario codificar correctamente
// Esa función no es necesaria, pero hace que el código sea legible
function toCString(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(str + "\0");
  return buffer;
}

// El string se modifica in-place. la memoria a la que apunta la variable cambia
export function toUpperCaseWithC(str: string): string {
  const buffer = toCString(str);
  const ptr = Deno.UnsafePointer.of(buffer);

  lib.symbols.toUpperCase(ptr);

  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}
