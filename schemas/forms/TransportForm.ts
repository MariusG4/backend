import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { integer, text } from "@keystone-6/core/fields";
import { permissions } from "../../access";

export const TransportForm: Lists.TransportForm = list({
  access: {
    operation: {
      query: permissions.canManageWorkerForms,
      create: () => true,
      update: permissions.canManageWorkerForms,
      delete: permissions.canManageWorkerForms,
    },
  },
  fields: {
    domeniu: text({ validation: { isRequired: true } }),
    subDomeniu: text({ validation: { isRequired: true } }),
    experienta: text({ validation: { isRequired: true } }),
    locatia: text({ validation: { isRequired: true } }),
    tahograf: text({ validation: { isRequired: true } }),
    echipa: text({ validation: { isRequired: true } }),
    turaNoapte: text({ validation: { isRequired: true } }),
    experientaLimba: text({ validation: { isRequired: true } }),
    ultimuSalar: integer({ validation: { isRequired: true } }),
    salariuDorit: integer({ validation: { isRequired: true } }),
  },
});
