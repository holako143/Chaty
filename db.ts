import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, chatRooms, InsertChatRoom, messages, InsertMessage, userPreferences, InsertUserPreference, gifts, InsertGift, roomBans, InsertRoomBan, wallPosts, InsertWallPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Chat Rooms queries
export async function getChatRooms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatRooms).orderBy(chatRooms.createdAt);
}

export async function getChatRoomById(roomId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(chatRooms).where(eq(chatRooms.id, roomId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createChatRoom(room: InsertChatRoom) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(chatRooms).values(room);
  return result;
}

// Messages queries
export async function getMessagesByRoomId(roomId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages)
    .where(eq(messages.roomId, roomId))
    .orderBy(messages.createdAt)
    .limit(limit);
}

export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(messages).values(message);
  return result;
}

// User Preferences queries
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateUserPreferences(userId: number, prefs: Partial<InsertUserPreference>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getUserPreferences(userId);
  if (existing) {
    return db.update(userPreferences).set(prefs).where(eq(userPreferences.userId, userId));
  } else {
    return db.insert(userPreferences).values({ userId, ...prefs } as InsertUserPreference);
  }
}

// Gifts queries
export async function sendGift(gift: InsertGift) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(gifts).values(gift);
}

export async function getGiftsByRecipient(recipientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gifts).where(eq(gifts.recipientId, recipientId)).orderBy(gifts.createdAt);
}

// Room Bans queries
export async function isBannedFromRoom(userId: number, roomId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(roomBans)
    .where(and(eq(roomBans.userId, userId), eq(roomBans.roomId, roomId)))
    .limit(1);
  return result.length > 0;
}

export async function banUserFromRoom(ban: InsertRoomBan) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(roomBans).values(ban);
}

// Wall Posts queries
export async function getWallPostsByRoomId(roomId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(wallPosts).where(eq(wallPosts.roomId, roomId)).orderBy(wallPosts.createdAt);
}

export async function createWallPost(post: InsertWallPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(wallPosts).values(post);
}

// TODO: add more feature queries here as your schema grows.
