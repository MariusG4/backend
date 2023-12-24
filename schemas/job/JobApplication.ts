import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import {
  calendarDay,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import { permissions, rules } from "../../access";
import { sendJobApplicationEmail } from "../../lib/mail";

export const JobApplication: Lists.JobApplication = list({
  access: {
    operation: {
      query: permissions.canManageJobApplications,
      create: () => true,
      update: permissions.canManageJobApplications,
      delete: permissions.canManageJobApplications,
    },
    filter: {
      query: rules.canManageJobApplications,
      update: rules.canManageJobApplications,
      delete: rules.canManageJobApplications,
      //create: () => true,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: {
        isRequired: true,
        match: { regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
      },
    }),
    message: text({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" },
    }),
    birthDate: calendarDay({
      validation: { isRequired: true },
    }),
    phone: text({
      validation: {
        isRequired: true,
        match: { regex: /^\d{1,3}\s?\d{1,14}$/ },
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" },
      },
    }),
    job: relationship({ ref: "Job.applyForm", many: false }),
    transport: relationship({
      ref: "TransportForm.jobApplication",
      many: false,
    }),
    medical: relationship({ ref: "MedicalForm.jobApplication", many: false }),
  },
  hooks: {
    afterOperation: async ({
      operation,
      listKey,
      item,
      originalItem,
      context,
    }) => {
      if (operation === "create") {
        const birthDateString = item.birthDate.toISOString().slice(0, 10);
        const jobTitle = await context.db.Job.findOne({
          where: { id: item.jobId },
        });
        const job = jobTitle?.title;
        if (item.medicalId) {
          const medicalForm = await context.db.MedicalForm.findOne({
            where: { id: item.medicalId },
          });
        } else if (item.transportId) {
          const transportForm = await context.db.TransportForm.findOne({
            where: { id: item.transportId },
          });
        } else {
          sendJobApplicationEmail(
            item.name,
            item.email,
            item.phone,
            item.message,
            birthDateString,
            job || ""
          );
        }
      }
    },
  },
});
