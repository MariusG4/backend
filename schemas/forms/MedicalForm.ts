import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { integer, text } from "@keystone-6/core/fields";
import { permissions } from "../../access";
import { sendMedicalFormEmail } from "../../lib/mail";

export const MedicalForm: Lists.MedicalForm = list({
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
    bac: text({ validation: { isRequired: true } }),
    amg: text({ validation: { isRequired: true } }),
    absolvire: text({ validation: { isRequired: true } }),
    experientaLimba: text({ validation: { isRequired: true } }),
    locatia: text({ validation: { isRequired: true } }),
    ultimuSalar: integer({ validation: { isRequired: true } }),
    cursItaliana: text({ validation: { isRequired: true } }),
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
