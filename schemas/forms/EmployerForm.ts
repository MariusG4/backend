import { permissions } from "../../access";
import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { integer, text } from "@keystone-6/core/fields";
import { sendEmployerFormEmail } from "../../lib/mail";

export const EmployerForm: Lists.EmployerForm = list({
  access: {
    operation: {
      query: permissions.canManageEmployerForms,
      create: () => true,
      update: permissions.canManageEmployerForms,
      delete: permissions.canManageEmployerForms,
    },
  },
  fields: {
    domeniu: text({ validation: { isRequired: true } }),
    subDomeniu: text({ validation: { isRequired: true } }),
    codFiscal: text({ validation: { isRequired: true } }),
    nrPersoane: text({ validation: { isRequired: true } }),
    dateContact: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true } }),
    nrTel: integer({ validation: { isRequired: true } }),
  },
  hooks: {
    afterOperation: async ({ context, operation, item, originalItem }) => {
      if (operation === "create") {
        sendEmployerFormEmail(
          item.domeniu,
          item.subDomeniu,
          item.codFiscal,
          item.nrPersoane,
          item.dateContact,
          item.email,
          item.nrTel
        );
      }
    },
  },
});
