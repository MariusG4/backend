import { allowAll } from "@keystone-6/core/access";
import { list } from "@keystone-6/core";
import { relationship, select } from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";
import { permissions } from "../access";

export const Language: Lists.Language = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageLanguage,
      update: permissions.canManageLanguage,
      delete: permissions.canManageLanguage,
    },
  },
  fields: {
    languages: select({
      type: "string",
      options: [
        { label: "IT", value: "IT" },
        { label: "RO", value: "RO" },
      ],
      defaultValue: "RO",
      validation: { isRequired: true },
      isIndexed: "unique",
      ui: {
        displayMode: "segmented-control",
        createView: { fieldMode: "edit" },
      },
    }),
    blog: relationship({ ref: "Blog.language", many: true }),
    job: relationship({ ref: "Job.language", many: true }),
  },
});
