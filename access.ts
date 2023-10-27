import { permissionsList } from "./schemas/permissions";
import { ListAccessArgs, Session } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
};

export const rules = {
  canManageBlogs({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageBlogs({ session })) {
      return true;
    }
    return { author: { id: { equals: session?.itemId } } };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    return { id: { equals: session?.itemId } };
  },
  canManageJobs({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageJobs({ session })) {
      return true;
    }
    return { user: { id: { equals: session?.itemId } } };
  },
  canManageJobApplications({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageJobApplications({ session })) {
      return true;
    }
    return { job: { user: { id: { equals: session?.itemId } } } };
  },
  canSeeUser({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canSeeOtherUsers({ session })) {
      return true;
    }
    return { blog: { author: { id: { equals: session?.itemId } } } };
  },
};
