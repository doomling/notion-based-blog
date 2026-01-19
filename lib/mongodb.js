import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add MONGODB_URI to your environment variables");
}

if (process.env.NODE_ENV === "development") {
  // Use global variable to preserve connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper to get database
export async function getDb() {
  const client = await clientPromise;
  return client.db("blog");
}

// User helpers
export async function getUserByEmail(email) {
  const db = await getDb();
  return db.collection("users").findOne({ email });
}

export async function createUser(email) {
  const db = await getDb();
  const user = {
    email,
    purchasedKits: [],
    createdAt: new Date(),
  };
  await db.collection("users").insertOne(user);
  return user;
}

export async function addKitPurchase(email, kitId, paymentId) {
  const db = await getDb();
  await db.collection("users").updateOne(
    { email },
    {
      $setOnInsert: { email, createdAt: new Date() },
      $push: {
        purchasedKits: {
          kitId,
          paymentId,
          purchasedAt: new Date(),
        },
      },
    },
    { upsert: true }
  );
}

export async function hasUserPurchasedKit(email, kitId) {
  const db = await getDb();
  const user = await db.collection("users").findOne({
    email,
    "purchasedKits.kitId": kitId,
  });
  return !!user;
}
