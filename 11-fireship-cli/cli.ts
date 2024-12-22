import { parseArgs } from "jsr:@std/cli/parse-args";
import { bgGreen, blue, magenta, red, yellow } from "jsr:@std/fmt/colors";

import { toKebabCase, toSnakeCase } from "jsr:@std/text";

import { toUpperCaseWithC } from "./ffi.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["snake", "kebab"],
  string: ["text"],
  default: { text: "Hi mom" },
});

console.log(flags);

const age = prompt("How old are you?");

if (parseInt(age!) < 21) {
  console.log(red("Not old enough"));
  Deno.exit();
}

console.log(); // Spacing
console.log(bgGreen("ACCESS GRANTED"));
console.log(); // Spacing

const shouldProceed = confirm("Wait, r u sure?");

if (!shouldProceed) {
  console.log(red("Termintated"));
  Deno.exit();
}

console.log(); // Spacing
console.log(yellow(flags.text.toUpperCase()));
console.log(yellow(toUpperCaseWithC(flags.text)));

flags.kebab && console.log(blue(toKebabCase(flags.text)));
flags.snake && console.log(magenta(toSnakeCase(flags.text)));
