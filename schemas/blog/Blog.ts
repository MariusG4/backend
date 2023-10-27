import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, select, text, timestamp } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import { componentBlocks } from "../../blocks";
import { permissions, rules } from "../../access";

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
    slug: text({ isIndexed: "unique", validation: { isRequired: true } }),
    dateCreated: timestamp({ defaultValue: { kind: "now" } }),
    dateModified: timestamp({ defaultValue: { kind: "now" } }),
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

    featured_image: text(),
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
      } catch (err) {
        console.log(err);
      }
    },
  },
});
