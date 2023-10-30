import { permissionFields } from "./permissions";
import { relationship, text } from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { permissions } from "../access";

export const Role: Lists.Role = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
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
