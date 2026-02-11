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

function normalizeKitId(kitId) {
  if (!kitId) return null;
  return String(kitId).replace(/-/g, "").toLowerCase();
}

// Stock helpers
export async function getKitStock(kitId) {
  const db = await getDb();
  const normalized = normalizeKitId(kitId);
  const record = await db.collection("kitStock").findOne({
    $or: [
      { kitId },
      { kitId: normalized },
      { kitIdNormalized: normalized },
    ],
  });
  if (!record) return null;
  if (typeof record.stock !== "number") return null;
  return record.stock;
}

export async function setKitStock(kitId, stock) {
  const db = await getDb();
  if (stock === null) {
    const normalized = normalizeKitId(kitId);
    await db.collection("kitStock").deleteOne({
      $or: [
        { kitId },
        { kitId: normalized },
        { kitIdNormalized: normalized },
      ],
    });
    return null;
  }
  const normalized = normalizeKitId(kitId);
  await db.collection("kitStock").updateOne(
    {
      $or: [
        { kitId },
        { kitId: normalized },
        { kitIdNormalized: normalized },
      ],
    },
    {
      $set: {
        stock,
        kitId,
        kitIdNormalized: normalized,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
  return stock;
}

export async function decrementKitStock(kitId) {
  const db = await getDb();
  const normalized = normalizeKitId(kitId);
  const existing = await db.collection("kitStock").findOne({
    $or: [
      { kitId },
      { kitId: normalized },
      { kitIdNormalized: normalized },
    ],
  });
  if (!existing) return true;
  if (typeof existing.stock !== "number") return true;

  const result = await db.collection("kitStock").findOneAndUpdate(
    {
      $or: [
        { kitId },
        { kitId: normalized },
        { kitIdNormalized: normalized },
      ],
      stock: { $gt: 0 },
    },
    {
      $inc: { stock: -1 },
      $set: { updatedAt: new Date() },
      $setOnInsert: { kitId, kitIdNormalized: normalized },
    },
    { returnDocument: "after" }
  );

  if (result.value) {
    if (process.env.STOCK_DEBUG === "true") {
      console.log("[stock] decremented", {
        kitId,
        normalized,
        stockBefore: existing.stock,
        stockAfter: result.value?.stock,
      });
    }
    return true;
  }

  if (existing.stock > 0 && existing._id) {
    const fallback = await db.collection("kitStock").findOneAndUpdate(
      { _id: existing._id, stock: { $gt: 0 } },
      { $inc: { stock: -1 }, $set: { updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (process.env.STOCK_DEBUG === "true") {
      console.log("[stock] fallback", {
        kitId,
        normalized,
        stockBefore: existing.stock,
        stockAfter: fallback.value?.stock,
      });
    }
    return !!fallback.value;
  }

  if (process.env.STOCK_DEBUG === "true") {
    console.log("[stock] exhausted", {
      kitId,
      normalized,
      stockBefore: existing.stock,
      existingId: String(existing._id),
    });
  }
  return false;
}
