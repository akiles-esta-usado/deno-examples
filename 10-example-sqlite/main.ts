import { Database } from "jsr:@db/sqlite@0.12";

const db = new Database("test.db");

/**
 * 1. Create the table
 * 2. Insert someone
 * 3. Query for everyone
 * 4. Show all of them
 */

db.prepare(
  `
	CREATE TABLE IF NOT EXISTS people (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  name TEXT,
	  age INTEGER
	);
  `,
).run();

db.prepare(
  `
	INSERT INTO people (name, age) VALUES (?, ?);
  `,
).run("Bob", 40);

const rows = db.prepare("SELECT id, name, age FROM people").all();

console.log("People:");

for (const row of rows) {
  console.log(row);
}

db.close();
