const https = require("https");
const fs = require("fs");
const path = require("path");

// Read Turso credentials from .env.local
const envFile = fs.readFileSync(path.resolve(__dirname, "../.env.local"), "utf8");
const envVars = {};
for (const line of envFile.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  envVars[key] = val;
}

const dbUrl = envVars.DATABASE_URL; // e.g. libsql://redoasis-db-....turso.io
const token = envVars.TURSO_AUTH_TOKEN;

if (!dbUrl || !token) {
  console.error("Missing DATABASE_URL or TURSO_AUTH_TOKEN in .env.local");
  process.exit(1);
}

// Extract hostname from libsql:// URL
const hostname = dbUrl.replace(/^libsql:\/\//, "").replace(/\/$/, "");
console.log("Connecting to:", hostname);

// Read and parse migration SQL
const sql = fs.readFileSync(path.resolve(__dirname, "../migration_phase2.sql"), "utf8");

// Split into individual statements (strip comments, split by semicolon)
const statements = sql
  .split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`Applying ${statements.length} SQL statements...`);

const requests = statements.map((s) => ({
  type: "execute",
  stmt: { sql: s },
}));
requests.push({ type: "close" });

const body = JSON.stringify({ requests });

const options = {
  hostname,
  path: "/v2/pipeline",
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  },
};

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      const errors = (json.results || []).filter((r) => r.type === "error");
      if (errors.length > 0) {
        console.error("Migration errors:");
        errors.forEach((e) => console.error(" -", e.error?.message || JSON.stringify(e)));
        process.exit(1);
      } else {
        console.log("✅ Migration applied successfully!");
        console.log(`   ${json.results.length - 1} statements executed.`);
      }
    } catch (e) {
      console.error("Failed to parse response:", data);
      process.exit(1);
    }
  });
});

req.on("error", (e) => {
  console.error("Request error:", e.message);
  process.exit(1);
});

req.write(body);
req.end();
