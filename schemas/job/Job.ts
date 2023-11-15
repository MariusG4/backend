import { list } from "@keystone-6/core";
import type { Lists } from ".keystone/types";
import { allowAll } from "@keystone-6/core/access";
import {
  calendarDay,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import { permissions } from "../../access";

export const Job: Lists.Job = list({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageJobs,
      create: permissions.canManageJobs,
      delete: permissions.canManageJobs,
    },
    //filter: {
    //  query: () => true,
    //  create: rules.canManageJobs,
    //  update: rules.canManageJobs,
    //  delete: rules.canManageJobs,
    //},
  },

  fields: {
    title: text({
      validation: {
        isRequired: true,
      },
    }),
    company: text({
      validation: {
        isRequired: true,
      },
    }),
    salary: text({
      validation: {
        isRequired: true,
        match: { regex: /^\d+(?:\.\d+)?€?$/ },
      },
    }),
    date: calendarDay(),

    jobCategory: relationship({
      ref: "JobCategory.jobs",
      many: false,
    }),
    location: relationship({
      ref: "Location.jobs",
      many: false,
      ui: {
        displayMode: "select",
        labelField: "name",
      },
    }),

    description: text({
      ui: { displayMode: "textarea" },
    }),
    requierments: text({
      ui: { displayMode: "textarea" },
    }),
    whyWork: text({
      ui: { displayMode: "textarea" },
    }),
    applyForm: relationship({
      ref: "JobApplication.job",
      many: true,
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" },
      },
    }),
    language: relationship({
      ref: "Language.job",
      many: false,
      ui: {
        hideCreate: true,
        displayMode: "select",
        labelField: "languages",
      },
    }),
    user: relationship({
      ref: "User.job",
      many: false,
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" },
      },
    }),

    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        itemView: {
          fieldMode: "hidden",
        },
      },
    }),
  },
  hooks: {
    beforeOperation: async ({ operation, resolvedData, context, item }) => {
      try {
        if (resolvedData && !resolvedData.user) {
          const currentUserId = await context.session.itemId;
          resolvedData.user = { connect: { id: currentUserId } };
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
});
