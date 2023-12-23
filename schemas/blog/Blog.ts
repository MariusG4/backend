import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { relationship, select, text, timestamp } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import { componentBlocks } from "../../blocks";
import { permissions, rules } from "../../access";

export function slugify(str: string): string {
  return str
    .replace(/^\s+|\s+$/g, "") // trim leading/trailing white space
    .toLowerCase() // convert string to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
}

export const Blog: Lists.Blog = list({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageBlogs,
      create: permissions.canManageBlogs,
      delete: permissions.canManageBlogs,
    },
    filter: {
      query: () => true,
      update: rules.canManageBlogs,
      delete: rules.canManageBlogs,
    },
  },

  ui: {
    listView: {
      initialColumns: [
        "title",
        "status",
        "dateModified",
        "author",
        "categories",
      ],
      initialSort: { field: "start", direction: "DESC" },
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    slug: text({ isIndexed: "unique" }),
    dateCreated: timestamp({
      ui: {
        itemView: { fieldMode: "hidden" },
      },
      access: {
        update: () => false,
      },
      validation: { isRequired: true },
      defaultValue: { kind: "now" },
    }),
    dateModified: timestamp({
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" },
      },
      db: {
        updatedAt: true,
      },
      defaultValue: { kind: "now" },
    }),
    status: select({
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Private", value: "PRIVATE" },
      ],
      defaultValue: "DRAFT",
      ui: {
        displayMode: "segmented-control",
        createView: { fieldMode: "edit" },
      },
    }),
    photo: relationship({
      ref: "MediaGalery.blog",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText", "filename"],
        inlineCreate: { fields: ["image", "altText", "filename"] },
        inlineEdit: { fields: ["image", "altText", "filename"] },
        inlineConnect: true,
      },
    }),

    content: document({
      componentBlocks,
      ui: {
        views: "./blocks",
      },
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
          code: true,
          superscript: true,
          keyboard: true,
        },
        listTypes: {
          ordered: true,
          unordered: true,
        },
        alignment: {
          center: true,
          end: true,
        },
        headingLevels: [1, 2, 3, 4, 5, 6],
        blockTypes: {
          blockquote: true,
          code: true,
        },
        softBreaks: true,
      },
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      links: true,
      dividers: true,
    }),

    author: relationship({
      ref: "User.blog",
      many: false,
      access: {
        read: () => true,
      },
    }),

    categories: relationship({
      ref: "Category.blog",
      many: true,
    }),

    tags: relationship({
      ref: "Tag.blog",
      many: true,
    }),

    language: relationship({
      ref: "Language.blog",
      ui: {
        hideCreate: true,
        displayMode: "select",
        labelField: "languages",
      },
      many: false,
    }),
  },

  hooks: {
    beforeOperation: async ({ operation, resolvedData, context, item }) => {
      try {
        if (resolvedData && !resolvedData.author) {
          const currentUserId = await context.session.itemId;
          resolvedData.author = { connect: { id: currentUserId } };
        }
        if (resolvedData && !resolvedData.slug) {
          resolvedData.slug = slugify(resolvedData.title as string);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
});
