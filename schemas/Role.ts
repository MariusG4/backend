import { permissionFields } from "./permissions";
import { relationship, text } from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { permissions } from "../access";

/**
 * Defines the `Role` list in the Keystone.js application.
 * The `Role` list represents a user role with associated permissions.
 * It includes fields for the role name, permissions, and users assigned to the role.
 */
export const Role: Lists.Role = list({
  access: {
    operation: {
      query: permissions.canManageRoles,
      create: permissions.canManageRoles,
      update: permissions.canManageRoles,
      delete: permissions.canManageRoles,
    },
  },
  fields: {
    name: text({
      validation: { isRequired: true },
    }),
    ...permissionFields,
    assignedTo: relationship({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "edit" },
      },
    }),
  },
});
