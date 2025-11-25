import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["guest", "member", "moderator", "admin"]).default("member").notNull(),
  avatar: varchar("avatar", { length: 255 }),
  countryFlag: varchar("countryFlag", { length: 10 }),
  stars: int("stars").default(0).notNull(),
  points: int("points").default(0).notNull(),
  lastActive: timestamp("lastActive").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Chat Rooms table
export const chatRooms = mysqlTable("chatRooms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isPrivate: boolean("isPrivate").default(false).notNull(),
  ownerId: int("ownerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = typeof chatRooms.$inferInsert;

// Messages table
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  isPrivate: boolean("isPrivate").default(false).notNull(),
  recipientId: int("recipientId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// User Preferences table (for customization)
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  nameColor: varchar("nameColor", { length: 7 }).default("#000000").notNull(),
  textColor: varchar("textColor", { length: 7 }).default("#000000").notNull(),
  backgroundColor: varchar("backgroundColor", { length: 7 }).default("#FFFFFF").notNull(),
  statusColor: varchar("statusColor", { length: 7 }).default("#00FF00").notNull(),
  decoration: varchar("decoration", { length: 255 }).default("").notNull(),
  status: varchar("status", { length: 255 }).default("متاح").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

// Gifts table
export const gifts = mysqlTable("gifts", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  giftName: varchar("giftName", { length: 255 }).notNull(),
  emoji: varchar("emoji", { length: 10 }).default("🎁").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Gift = typeof gifts.$inferSelect;
export type InsertGift = typeof gifts.$inferInsert;

// Room Bans table
export const roomBans = mysqlTable("roomBans", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  bannedBy: int("bannedBy").notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type RoomBan = typeof roomBans.$inferSelect;
export type InsertRoomBan = typeof roomBans.$inferInsert;

// Wall Posts table
export const wallPosts = mysqlTable("wallPosts", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WallPost = typeof wallPosts.$inferSelect;
export type InsertWallPost = typeof wallPosts.$inferInsert;

// Content Filters table (for filtering offensive words)
export const contentFilters = mysqlTable("contentFilters", {
  id: int("id").autoincrement().primaryKey(),
  word: varchar("word", { length: 255 }).notNull().unique(),
  type: mysqlEnum("type", ["offensive", "spam", "custom"]).default("custom").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentFilter = typeof contentFilters.$inferSelect;
export type InsertContentFilter = typeof contentFilters.$inferInsert;

// Reports table (for reporting inappropriate content)
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull(),
  reportedUserId: int("reportedUserId"),
  messageId: int("messageId"),
  reason: text("reason").notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "resolved", "dismissed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// Audio Status table (for tracking microphone status)
export const audioStatus = mysqlTable("audioStatus", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  roomId: int("roomId").notNull(),
  micStatus: boolean("micStatus").default(false).notNull(),
  isSpeaking: boolean("isSpeaking").default(false).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AudioStatus = typeof audioStatus.$inferSelect;
export type InsertAudioStatus = typeof audioStatus.$inferInsert;

// Admin Logs table (for tracking admin actions)
export const adminLogs = mysqlTable("adminLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  target: varchar("target", { length: 255 }),
  targetId: int("targetId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;

// Settings table (for global and user settings)
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  theme: varchar("theme", { length: 50 }).default("light").notNull(),
  colors: text("colors"),
  notifications: boolean("notifications").default(true).notNull(),
  privateMessagesEnabled: boolean("privateMessagesEnabled").default(true).notNull(),
  soundNotifications: boolean("soundNotifications").default(true).notNull(),
  language: varchar("language", { length: 10 }).default("ar").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

// Announcements table (for admin announcements)
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  createdBy: int("createdBy").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["global", "room", "user"]).default("global").notNull(),
  targetId: int("targetId"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

// Reactions table
export const reactions = mysqlTable("reactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  messageId: int("messageId").notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Reaction = typeof reactions.$inferSelect;
export type InsertReaction = typeof reactions.$inferInsert;

// Friends table
export const friends = mysqlTable("friends", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  friendId: int("friendId").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "blocked"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Friend = typeof friends.$inferSelect;
export type InsertFriend = typeof friends.$inferInsert;