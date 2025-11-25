import type { User } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

export type UserRole = "guest" | "member" | "moderator" | "admin";

/**
 * Permission definitions for each role
 */
const guestPerms = [
  "view_public_rooms",
  "view_messages",
  "view_wall",
  "view_users",
];

const memberPerms = [
  ...guestPerms,
  "view_private_rooms",
  "send_messages",
  "send_private_messages",
  "send_gifts",
  "post_on_wall",
  "react_to_messages",
  "manage_friends",
  "use_microphone",
  "report_content",
];

const moderatorPerms = [
  ...memberPerms,
  "delete_messages",
  "mute_users",
  "kick_users",
  "publish_announcements",
  "manage_filters",
  "view_activity_logs",
  "manage_room_content",
];

const adminPerms = [
  ...moderatorPerms,
  "manage_users",
  "manage_roles",
  "ban_users",
  "manage_global_settings",
  "manage_announcements",
  "view_all_logs",
  "manage_content_filters",
  "manage_rooms",
  "manage_admins",
  "access_admin_panel",
];

export const rolePermissions: Record<UserRole, Set<string>> = {
  guest: new Set(guestPerms),
  member: new Set(memberPerms),
  moderator: new Set(moderatorPerms),
  admin: new Set(adminPerms),
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User, permission: string): boolean {
  const permissions = rolePermissions[user.role as UserRole];
  return permissions?.has(permission) ?? false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(user: User, permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(user: User, permissions: string[]): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}

/**
 * Enforce a permission check and throw an error if the user doesn't have it
 */
export function enforcePermission(user: User, permission: string): void {
  if (!hasPermission(user, permission)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have permission to perform this action: ${permission}`,
    });
  }
}

/**
 * Enforce any of the specified permissions
 */
export function enforceAnyPermission(user: User, permissions: string[]): void {
  if (!hasAnyPermission(user, permissions)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have permission to perform this action`,
    });
  }
}

/**
 * Enforce all of the specified permissions
 */
export function enforceAllPermissions(user: User, permissions: string[]): void {
  if (!hasAllPermissions(user, permissions)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have all required permissions to perform this action`,
    });
  }
}

/**
 * Check if a user can manage another user (based on role hierarchy)
 */
export function canManageUser(manager: User, target: User): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    guest: 0,
    member: 1,
    moderator: 2,
    admin: 3,
  };

  return roleHierarchy[manager.role as UserRole] > roleHierarchy[target.role as UserRole];
}

/**
 * Check if a user can delete a message
 */
export function canDeleteMessage(user: User, messageAuthorId: number): boolean {
  // Admins and moderators can delete any message
  if (hasPermission(user, "delete_messages")) {
    return true;
  }

  // Users can delete their own messages
  return user.id === messageAuthorId;
}

/**
 * Check if a user can edit a message
 */
export function canEditMessage(user: User, messageAuthorId: number): boolean {
  // Only the author can edit their own message
  return user.id === messageAuthorId;
}

/**
 * Check if a user can access admin panel
 */
export function canAccessAdminPanel(user: User): boolean {
  return hasPermission(user, "access_admin_panel");
}

/**
 * Get all available roles
 */
export function getAllRoles(): UserRole[] {
  return ["guest", "member", "moderator", "admin"];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    guest: "زائر",
    member: "عضو",
    moderator: "مشرف",
    admin: "إدارة",
  };
  return names[role];
}
