import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";
import { permissions } from "../../access";

export const Country: Lists.Country = list({
  access: {
    operation: {
      create: permissions.canManageLocations,
      query: () => true,
      update: permissions.canManageLocations,
      delete: permissions.canManageLocations,
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
    }),
  },
});
