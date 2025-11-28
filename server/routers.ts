import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Chat Rooms Router
  rooms: router({
    list: publicProcedure.query(() => db.getChatRooms()),
    getById: publicProcedure.input(z.number()).query(({ input }) => db.getChatRoomById(input)),
    create: protectedProcedure
      .input(z.object({ name: z.string(), description: z.string().optional(), isPrivate: z.boolean().optional() }))
      .mutation(({ input, ctx }) => 
        db.createChatRoom({ ...input, ownerId: ctx.user.id, isPrivate: input.isPrivate || false })
      ),
  }),

  // Messages Router
  messages: router({
    getByRoom: publicProcedure
      .input(z.number())
      .query(({ input }) => db.getMessagesByRoomId(input)),
    send: protectedProcedure
      .input(z.object({ roomId: z.number(), content: z.string(), isPrivate: z.boolean().optional(), recipientId: z.number().optional() }))
      .mutation(({ input, ctx }) => 
        db.createMessage({ roomId: input.roomId, userId: ctx.user.id, content: input.content, isPrivate: input.isPrivate || false, recipientId: input.recipientId })
      ),
  }),

  // User Preferences Router
  preferences: router({
    get: protectedProcedure.query(({ ctx }) => db.getUserPreferences(ctx.user.id)),
    update: protectedProcedure
      .input(z.object({
        nameColor: z.string().optional(),
        textColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        statusColor: z.string().optional(),
        decoration: z.string().optional(),
        status: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => db.createOrUpdateUserPreferences(ctx.user.id, input)),
  }),

  // Gifts Router
  gifts: router({
    send: protectedProcedure
      .input(z.object({ recipientId: z.number(), giftName: z.string(), emoji: z.string().optional() }))
      .mutation(({ input, ctx }) => 
        db.sendGift({ senderId: ctx.user.id, recipientId: input.recipientId, giftName: input.giftName, emoji: input.emoji || "🎁" })
      ),
    getReceived: protectedProcedure.query(({ ctx }) => db.getGiftsByRecipient(ctx.user.id)),
  }),

  // Room Management Router
  management: router({
    banUser: protectedProcedure
      .input(z.object({ roomId: z.number(), userId: z.number(), reason: z.string().optional() }))
      .mutation(({ input, ctx }) => 
        db.banUserFromRoom({ roomId: input.roomId, userId: input.userId, bannedBy: ctx.user.id, reason: input.reason })
      ),
    isBanned: publicProcedure
      .input(z.object({ roomId: z.number(), userId: z.number() }))
      .query(({ input }) => db.isBannedFromRoom(input.userId, input.roomId)),
  }),

  // Wall Posts Router
  wall: router({
    getByRoom: publicProcedure
      .input(z.number())
      .query(({ input }) => db.getWallPostsByRoomId(input)),
    post: protectedProcedure
      .input(z.object({ roomId: z.number(), content: z.string() }))
      .mutation(({ input, ctx }) => db.createWallPost({ roomId: input.roomId, userId: ctx.user.id, content: input.content })),
  }),
});

export type AppRouter = typeof appRouter;
