import { list } from "@keystone-6/core";
import { text, image, relationship } from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { permissions } from "../../access";
import { createId } from "@paralleldrive/cuid2";
require("dotenv").config();

function makeCustomIdentifier(filename: string) {
  return `${filename.split(".")[0].replace(/\s+/g, "-")}-${createId()}`;
}
export const cloudinary = {
  cloudName: process.env.CLOUDINARY_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: process.env.CLOUDINARY_API_FOLDER,
};
console.log("👍🏽 Cloudinary is configured");

export const MediaGalery: Lists.MediaGalery = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageProducts,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts,
    },
  },
  db: { idField: { kind: "string" } },

  fields: {
    image: cloudinaryImage({
      // @ts-ignore
      cloudinary,
      label: "Source",
    }),

    //image : image ({
    //  storage:'my_local_storage'
    //
    //}),
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
  hooks: {
    resolveInput: {
      create: async ({ operation, item, inputData, resolvedData }) => {
        const imageData = resolvedData.image;
        const imageFilename = imageData?.filename;

        //console.log(imageFilename, imageId, imageMeta.public_id, cchangeID);
        //console.log(resolvedData);
        //return resolvedData;
        return {
          ...resolvedData,
          id: makeCustomIdentifier(imageFilename),
        };
      },
    },
  },
});
