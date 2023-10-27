import { list } from "@keystone-6/core";
import type { Lists } from ".keystone/types";
import {
  checkbox,
  password,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import { permissions, rules } from "../access";

export const User: Lists.User = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageUsers,
      update: permissions.canManageUsers,
      delete: permissions.canManageUsers,
    },
  },
  ui: {},
  fields: {
    name: text({
      validation: { isRequired: true },
      access: {
        read: () => true,
      },
    }),
    nameLast: text(),
    email: text({
      validation: { isRequired: true },
      isIndexed: "unique",
      access: {
        read: permissions.canManageUsers,
      },
    }),
    password: password({ validation: { isRequired: true } }),
    isAdmin: checkbox({ defaultValue: false }),
    isActive: checkbox({ defaultValue: true }),
    blog: relationship({
      ref: "Blog.author",
      many: true,
      access: {
        read: () => true,
      },
    }),
    job: relationship({ ref: "Job.user" }),
    role: relationship({
      ref: "Role.assignedTo",
      many: false,
      access: {
        read: permissions.canManageRoles,
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
    }),
    dateModified: timestamp({ defaultValue: { kind: "now" } }),
  },
});
