import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import {
  integer,
  text,
  relationship,
  timestamp,
} from "@keystone-6/core/fields";
import { permissions } from "../../access";
import { sendMedicalFormEmail } from "../../lib/mail";

export const MedicalForm: Lists.MedicalForm = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: permissions.canManageWorkerForms,
      delete: permissions.canManageWorkerForms,
    },
  },

  fields: {
    domeniu: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    subDomeniu: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    experienta: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    bac: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    amg: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    absolvire: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    experientaLimba: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    locatia: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    ultimuSalar: integer({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    cursItaliana: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    jobApplication: relationship({
      ref: "JobApplication.medical",
      many: false,
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" },
      },
    }),
    phone: text({
      validation: {
        isRequired: true,
        match: {
          regex: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          explanation: "Must be a valid phone number",
        },
      },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" },
      },
    }),
  },
  hooks: {
    afterOperation: async ({ context, operation, item, originalItem }) => {
      if (operation === "create") {
        sendMedicalFormEmail(
          item.domeniu,
          item.subDomeniu,
          item.experienta,
          item.bac,
          item.amg,
          item.absolvire,
          item.experientaLimba,
          item.locatia,
          item.ultimuSalar,
          item.cursItaliana
        );
      }
    },
  },
});
