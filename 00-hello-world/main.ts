function greet(name: string): string {
  return `Hello, ${name}`;
}

console.log(greet("World"));

console.log(Deno.args);
