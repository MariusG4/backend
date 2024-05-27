import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import {
  integer,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import { permissions } from "../../access";
import { sendTransportFormEmail } from "../../lib/mail";

export const TransportForm: Lists.TransportForm = list({
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
    locatia: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    tahograf: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    echipa: text({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    turaNoapte: text({
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
    ultimuSalar: integer({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    salariuDorit: integer({
      validation: { isRequired: true },
      access: {
        read: permissions.canManageWorkerForms,
      },
    }),
    jobApplication: relationship({
      ref: "JobApplication.transport",
      many: false,
    }),
    phone: text({
      validation: {
        isRequired: true,
        match: { regex: /^\d{1,3}\s?\d{1,14}$/ },
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
    afterOperation: async ({
      operation,
      listKey,
      item,
      originalItem,
      context,
    }) => {
      if (operation === "create") {
        sendTransportFormEmail(
          item.domeniu,
          item.subDomeniu,
          item.experienta,
          item.locatia,
          item.tahograf,
          item.echipa,
          item.turaNoapte,
          item.experientaLimba,
          item.ultimuSalar,
          item.salariuDorit
        );
      }
    },
  },
});
