import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient, ObjectId } from "mongodb";
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
const USER_NAME = process.env.USER_NAME || "VibeFlow User";

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

async function createUser(name, email, password) {
  const result = await auth.api.signUpEmail({ body: { name, email, password } });
  return result.user;
}

async function canLogin(email, password) {
  try {
    const result = await auth.api.signInEmail({ body: { email, password } });
    return Boolean(result.user);
  } catch {
    return false;
  }
}

async function deleteUserByEmail(email) {
  const user = await db.collection("user").findOne({ email });
  if (!user) return false;
  const userId = user._id;
  await db.collection("session").deleteMany({ userId: new ObjectId(userId) });
  await db.collection("account").deleteMany({ userId: new ObjectId(userId) });
  await db.collection("user").deleteOne({ email });
  return true;
}

async function seedAccount({ name, email, password, role }) {
  const existing = await db.collection("user").findOne({ email });

  if (existing) {
    if (await canLogin(email, password)) {
      if ((existing.role || "user") !== role) {
        await db.collection("user").updateOne({ email }, { $set: { role } });
        console.log(`${role} ${email} exists with current credentials; updated role to ${role}.`);
      } else {
        console.log(`${role} ${email} already exists with current credentials.`);
      }
      return;
    }

    await deleteUserByEmail(email);
    const user = await createUser(name, email, password);
    await db.collection("user").updateOne({ email: user.email }, { $set: { role } });
    console.log(`${role} ${email} existed with stale credentials; recreated with role ${role}.`);
    return;
  }

  const user = await createUser(name, email, password);
  await db.collection("user").updateOne({ email: user.email }, { $set: { role } });
  console.log(`Created ${role} account ${user.email} (role: ${role}).`);
}

async function clearSeedSessions() {
  const users = await db
    .collection("user")
    .find({ email: { $in: [ADMIN_EMAIL, USER_EMAIL].filter(Boolean) } })
    .toArray();
  const ids = users.map((u) => u._id);
  if (ids.length > 0) {
    await db.collection("session").deleteMany({ userId: { $in: ids } });
  }
}

async function main() {
  await client.connect();
  console.log("Connected to MongoDB.");

  await seedAccount({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });

  const conflictingAdmins = await db
    .collection("user")
    .find({ role: "admin", email: { $ne: ADMIN_EMAIL } })
    .toArray();
  for (const doc of conflictingAdmins) {
    await db.collection("user").updateOne({ _id: doc._id }, { $set: { role: "user" } });
    console.log(`Demoted conflicting admin account ${doc.email} to role user.`);
  }

  if (USER_EMAIL && USER_PASSWORD) {
    await seedAccount({
      name: USER_NAME,
      email: USER_EMAIL,
      password: USER_PASSWORD,
      role: "user",
    });

    await db.collection("user").updateOne(
      { email: USER_EMAIL },
      { $set: { role: "user" } }
    );
  }

  await clearSeedSessions();
  console.log("Seed complete. Passwords are stored only in .env.local.");
  await client.close();
}

main().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
