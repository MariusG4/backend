import { list } from "@keystone-6/core";
import type { Lists } from ".keystone/types";
import { allowAll } from "@keystone-6/core/access";
import { text } from "@keystone-6/core/fields";

export const ContactForm: Lists.ContactForm = list({
  access: {
    operation: {
      query: () => false,
      create: () => true,
      update: () => false,
      delete: () => false,
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
});
