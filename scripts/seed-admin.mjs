import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

function loadEnvFile() {
  const file = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(file, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local is optional — rely on process.env
  }
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_NAME || "VibeFlow Admin";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const USER_EMAIL = (process.env.USER_EMAIL || "").toLowerCase();
const USER_PASSWORD = process.env.USER_PASSWORD || "";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local or the environment.");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
const db = client.db("vibeflow_auth");

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client, transaction: false }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
});

async function userExists(email) {
  return Boolean(await db.collection("user").findOne({ email }));
}

async function createUser(name, email, password) {
  const result = await auth.api.signUpEmail({ body: { name, email, password } });
  return result.user;
}

async function main() {
  await client.connect();
  console.log("Connected to MongoDB.");

  if (await userExists(ADMIN_EMAIL)) {
    console.log(`Admin already exists (${ADMIN_EMAIL}). Nothing to do.`);
  } else {
    const user = await createUser(ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD);
    await db.collection("user").updateOne({ email: user.email }, { $set: { role: "admin" } });
    console.log(`Created admin account: ${user.email} (role: admin).`);
  }

  if (USER_EMAIL && USER_PASSWORD) {
    if (await userExists(USER_EMAIL)) {
      console.log(`User already exists (${USER_EMAIL}). Nothing to do.`);
    } else {
      const user = await createUser("VibeFlow User", USER_EMAIL, USER_PASSWORD);
      console.log(`Created normal user: ${user.email} (role: user).`);
    }
  }

  console.log("Seed complete. Passwords are stored only in .env.local.");
  await client.close();
}

main().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
