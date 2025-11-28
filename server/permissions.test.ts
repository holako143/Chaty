import { describe, it, expect } from "vitest";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canManageUser,
  canDeleteMessage,
  canEditMessage,
  canAccessAdminPanel,
  getRoleDisplayName,
  getAllRoles,
} from "./permissions";
import type { User } from "../drizzle/schema";

// Mock users with different roles
const guestUser: User = {
  id: 1,
  openId: "guest-1",
  name: "Guest User",
  email: "guest@example.com",
  loginMethod: "guest",
  role: "guest",
  avatar: null,
  countryFlag: null,
  stars: 0,
  points: 0,
  lastActive: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const memberUser: User = {
  id: 2,
  openId: "member-1",
  name: "Member User",
  email: "member@example.com",
  loginMethod: "manus",
  role: "member",
  avatar: null,
  countryFlag: null,
  stars: 5,
  points: 100,
  lastActive: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const moderatorUser: User = {
  id: 3,
  openId: "mod-1",
  name: "Moderator User",
  email: "mod@example.com",
  loginMethod: "manus",
  role: "moderator",
  avatar: null,
  countryFlag: null,
  stars: 10,
  points: 500,
  lastActive: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const adminUser: User = {
  id: 4,
  openId: "admin-1",
  name: "Admin User",
  email: "admin@example.com",
  loginMethod: "manus",
  role: "admin",
  avatar: null,
  countryFlag: null,
  stars: 100,
  points: 10000,
  lastActive: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("Permission System", () => {
  describe("hasPermission", () => {
    it("should allow guests to view public rooms", () => {
      expect(hasPermission(guestUser, "view_public_rooms")).toBe(true);
    });

    it("should deny guests from sending messages", () => {
      expect(hasPermission(guestUser, "send_messages")).toBe(false);
    });

    it("should allow members to send messages", () => {
      expect(hasPermission(memberUser, "send_messages")).toBe(true);
    });

    it("should deny members from deleting messages", () => {
      expect(hasPermission(memberUser, "delete_messages")).toBe(false);
    });

    it("should allow moderators to delete messages", () => {
      expect(hasPermission(moderatorUser, "delete_messages")).toBe(true);
    });

    it("should allow admins to access admin panel", () => {
      expect(hasPermission(adminUser, "access_admin_panel")).toBe(true);
    });

    it("should deny members from accessing admin panel", () => {
      expect(hasPermission(memberUser, "access_admin_panel")).toBe(false);
    });
  });

  describe("hasAnyPermission", () => {
    it("should return true if user has any of the specified permissions", () => {
      expect(
        hasAnyPermission(memberUser, [
          "delete_messages",
          "send_messages",
          "view_public_rooms",
        ])
      ).toBe(true);
    });

    it("should return false if user has none of the specified permissions", () => {
      expect(
        hasAnyPermission(guestUser, ["delete_messages", "manage_users"])
      ).toBe(false);
    });
  });

  describe("hasAllPermissions", () => {
    it("should return true if user has all specified permissions", () => {
      expect(
        hasAllPermissions(memberUser, [
          "send_messages",
          "view_public_rooms",
          "send_gifts",
        ])
      ).toBe(true);
    });

    it("should return false if user is missing any permission", () => {
      expect(
        hasAllPermissions(memberUser, [
          "send_messages",
          "delete_messages",
          "view_public_rooms",
        ])
      ).toBe(false);
    });
  });

  describe("canManageUser", () => {
    it("should allow admin to manage moderator", () => {
      expect(canManageUser(adminUser, moderatorUser)).toBe(true);
    });

    it("should allow moderator to manage member", () => {
      expect(canManageUser(moderatorUser, memberUser)).toBe(true);
    });

    it("should deny member from managing moderator", () => {
      expect(canManageUser(memberUser, moderatorUser)).toBe(false);
    });

    it("should deny user from managing themselves", () => {
      expect(canManageUser(memberUser, memberUser)).toBe(false);
    });
  });

  describe("canDeleteMessage", () => {
    it("should allow moderator to delete any message", () => {
      expect(canDeleteMessage(moderatorUser, memberUser.id)).toBe(true);
    });

    it("should allow user to delete their own message", () => {
      expect(canDeleteMessage(memberUser, memberUser.id)).toBe(true);
    });

    it("should deny user from deleting others' messages", () => {
      expect(canDeleteMessage(memberUser, moderatorUser.id)).toBe(false);
    });
  });

  describe("canEditMessage", () => {
    it("should allow user to edit their own message", () => {
      expect(canEditMessage(memberUser, memberUser.id)).toBe(true);
    });

    it("should deny user from editing others' messages", () => {
      expect(canEditMessage(memberUser, adminUser.id)).toBe(false);
    });
  });

  describe("canAccessAdminPanel", () => {
    it("should allow admin to access admin panel", () => {
      expect(canAccessAdminPanel(adminUser)).toBe(true);
    });

    it("should allow moderator to access admin panel", () => {
      expect(canAccessAdminPanel(moderatorUser)).toBe(true);
    });

    it("should deny member from accessing admin panel", () => {
      expect(canAccessAdminPanel(memberUser)).toBe(false);
    });

    it("should deny guest from accessing admin panel", () => {
      expect(canAccessAdminPanel(guestUser)).toBe(false);
    });
  });

  describe("getRoleDisplayName", () => {
    it("should return correct display name for each role", () => {
      expect(getRoleDisplayName("guest")).toBe("زائر");
      expect(getRoleDisplayName("member")).toBe("عضو");
      expect(getRoleDisplayName("moderator")).toBe("مشرف");
      expect(getRoleDisplayName("admin")).toBe("إدارة");
    });
  });

  describe("getAllRoles", () => {
    it("should return all available roles", () => {
      const roles = getAllRoles();
      expect(roles).toContain("guest");
      expect(roles).toContain("member");
      expect(roles).toContain("moderator");
      expect(roles).toContain("admin");
      expect(roles.length).toBe(4);
    });
  });
});
