import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  console.log("Connecting to Turso...");
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const sqlPath = path.join(process.cwd(), "migration.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");

  console.log("Executing schema...");
  try {
    await client.executeMultiple(sql);
    console.log("Schema pushed successfully!");
  } catch (error) {
    console.error("Error executing schema:", error);
  }
}

run();
