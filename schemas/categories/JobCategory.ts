import { list } from "@keystone-6/core";
import type { Lists } from ".keystone/types";
import { relationship, text } from "@keystone-6/core/fields";
import { permissions } from "../../access";

export const JobCategory: Lists.JobCategory = list({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageCategories,
      create: permissions.canManageCategories,
      delete: permissions.canManageCategories,
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
    }),
    category: relationship({
      ref: "Category.jobCategories",
      many: false,
    }),
    subcategories: relationship({
      ref: "SubCategory",
      many: true,
    }),
    jobs: relationship({
      ref: "Job.jobCategory",
      many: true,
    }),
  },
});
