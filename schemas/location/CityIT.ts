import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { relationship, text, timestamp } from "@keystone-6/core/fields";
import { permissions } from "../../access";

export const CityIT: Lists.CityIT = list({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageLocations,
      create: permissions.canManageLocations,
      delete: permissions.canManageLocations,
    },
  },
  fields: {
    name: text({
      validation: { isRequired: true },
    }),
    nameIT: text({
      validation: { isRequired: true },
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      validation: { isRequired: true },
      isIndexed: true,
    }),
  },
});
