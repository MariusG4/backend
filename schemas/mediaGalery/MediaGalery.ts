import { list } from "@keystone-6/core";
import { text, image, relationship } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import type { Lists } from ".keystone/types";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { fields } from "@keystone-6/core/dist/declarations/src/types/schema/schema-api-with-context";
import { permissions } from "../../access";
require("dotenv").config();

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: process.env.CLOUDINARY_API_FOLDER,
};
const cloudname = process.env.CLOUDINARY_NAME;
console.log(cloudname + "👍🏽 Cloudinary is configured");

export const MediaGalery: Lists.MediaGalery = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageProducts,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts,
    },
  },

  fields: {
    image: cloudinaryImage({
      cloudinary,
      label: "Source",
    }),

    //image : image ({storage:'my_local_storage'}),
    altText: text(),
    filename: text({
      isIndexed: "unique",
      validation: {
        isRequired: true,
      },
    }),
    blog: relationship({
      ref: "Blog.photo",
    }),
  },
  ui: {
    listView: {
      initialColumns: ["image", "altText", "product"],
    },
  },
});
