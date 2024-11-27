import { Database } from "@db/sqlite";

import { toKebabCase } from "@std/text";

const db = new Database("horses.db");
db.exec(`
  DROP TABLE IF EXISTS horses;
  CREATE TABLE horses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    permalink TEXT
  );
  `);

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;
  const id = path.split("/")[2];

  if (!path.startsWith("/horse")) {
    return new Response(
      JSON.stringify({ message: "Not Found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (req.method === "GET" && !id) {
    const horses = db.prepare("SELECT * FROM horses").all();

    return new Response(
      JSON.stringify(horses),
      {
        headers: { "Content-Type": "application/json" },
        status: horses.length ? 200 : 404,
      },
    );
  }

  if (req.method === "GET" && id) {
    const horse = db.prepare("SELECT * FROM horses WHERE id = :id").get({ id });
    return new Response(
      JSON.stringify(horse),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  }

  if (req.method === "POST") {
    try {
      const { name, age } = await req.json();
      const permalink = "horsetider.dev/" + toKebabCase(name);

      const horse = db.prepare(
        "INSERT INTO horses (name, age, permalink) VALUES (?, ?, ?) RETURNING *",
      ).get([name, age, permalink]);

      return new Response(
        JSON.stringify(horse),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (err) {
      console.log(err);
      return new Response(
        JSON.stringify({ message: "Invalid request body" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
});

console.log("Server running on http://localhost:8000");
