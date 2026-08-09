import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required for authentication.");
}

const cachedClient = global.authMongoClient || new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});

if (!global.authMongoClient) {
  global.authMongoClient = cachedClient;
}

const AUTH_DB_NAME = "vibeflow_auth";
const db = cachedClient.db(AUTH_DB_NAME);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client: cachedClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
});

/**
 * Server-side authorization guard for API routes.
 * Returns a session object when the request belongs to an authenticated
 * admin user, otherwise a null-safe result with the error to return.
 */
export async function requireAdmin(request) {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    console.error("getSession failed:", error);
  }

  if (!session) {
    return { error: "Not authenticated. Please log in.", status: 401 };
  }

  if (session.user.role !== "admin") {
    return { error: "You do not have permission to perform this action.", status: 403 };
  }

  return { session };
}
