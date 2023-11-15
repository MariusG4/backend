import type { Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { permissions } from "../../access";
import { relationship, select, text } from "@keystone-6/core/fields";

export const Location: Lists.Location = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageLocations,
      update: permissions.canManageLocations,
      delete: permissions.canManageLocations,
    },
  },
  fields: {
    name: text(),
    nameIT: text(),
    country: relationship({
      ref: "Country",
      many: true,
      ui: {
        displayMode: "select",
        labelField: "name",
      },
    }),

    cityRO: relationship({
      ref: "CityRO",
      many: true,
      ui: {
        displayMode: "select",
        labelField: "name",
        searchFields: ["name"],
      },
    }),
    cityIT: relationship({
      ref: "CityIT",
      many: true,
      ui: {
        displayMode: "select",
        labelField: "name",
        searchFields: ["name"],
      },
    }),

    zone: select({
      type: "string",
      options: [
        { label: "Local", value: "Local" },
        { label: "International", value: "International" },
        { label: "Tur-retur", value: "Tur-retur" },
      ],
    }),
    jobs: relationship({
      ref: "Job.location",
      many: true,
    }),
  },
});
