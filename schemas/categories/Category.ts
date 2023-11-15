import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";
import { permissions } from "../../access";

export const Category: Lists.Category = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageCategories,
      update: permissions.canManageCategories,
      delete: permissions.canManageCategories,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    nameIT: text({ validation: { isRequired: true } }),
    excerpt: text({
      ui: {
        displayMode: "textarea",
      },
    }),
    excerptIT: text({
      ui: {
        displayMode: "textarea",
      },
    }),
    blog: relationship({ ref: "Blog.categories", many: true }),
    jobCategories: relationship({ ref: "JobCategory.category", many: true }),
  },
});
