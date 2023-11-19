import { JSONPreset } from "lowdb/node";

// Read or create db.json
const defaultData = { envelopes: [] };
const db = await JSONPreset("db.json", defaultData);

// Create and query items using plain JavaScript
db.data.envelopes.push({ id: 7, name: "Test", budget: 150 });
const firstPost = db.data.envelopes[0];

// If you don't want to type db.data everytime, you can use destructuring assignment
const { envelopes } = db.data;
envelopes.push('hello world')

// Finally write db.data content to file
await db.write();
