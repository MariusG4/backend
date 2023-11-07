import { list } from "@keystone-6/core";
import type { Lists } from ".keystone/types";
import { text } from "@keystone-6/core/fields";
import { permissions } from "../../access";
import { sendContactUsEmail } from "../../lib/mail";

export const ContactForm: Lists.ContactForm = list({
  access: {
    operation: {
      query: permissions.canManageContactForms,
      create: () => true,
      update: permissions.canManageContactForms,
      delete: permissions.canManageContactForms,
    },
  },

  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
    }),
    email: text({
      validation: {
        isRequired: true,
        match: { regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
      },
    }),
    phone: text({
      validation: {
        isRequired: true,
        match: { regex: /^\d{1,3}\s?\d{1,14}$/ },
      },
    }),

    message: text({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" },
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
        sendContactUsEmail(item.name, item.email, item.phone, item.message);
      }
    },
  },
});
