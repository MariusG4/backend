import type { Lists } from ".keystone/types";
import { relationship, text } from "@keystone-6/core/fields";
import { permissions } from "../../access";
import { list } from "@keystone-6/core";

export const SubCategory: Lists.SubCategory = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageCategories,
      update: permissions.canManageCategories,
      delete: permissions.canManageCategories,
    },
  },
  fields: {
    name: text(),
    category: relationship({
      ref: "Category",
      many: false,
    }),
  },
});
