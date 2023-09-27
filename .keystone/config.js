"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core7 = require("@keystone-6/core");

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// schemas/Language.ts
var import_access = require("@keystone-6/core/access");
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var Language = (0, import_core.list)({
  access: import_access.allowAll,
  fields: {
    languages: (0, import_fields.select)({
      type: "string",
      options: [
        { label: "IT", value: "IT" },
        { label: "RO", value: "RO" }
      ],
      defaultValue: "RO",
      validation: { isRequired: true },
      isIndexed: "unique",
      ui: { displayMode: "select" }
    }),
    blog: (0, import_fields.relationship)({ ref: "Blog.language" })
  }
});

// schemas/Blog.ts
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var Blog = (0, import_core2.list)({
  access: import_access2.allowAll,
  ui: {
    listView: {
      initialColumns: ["title", "status", "dateModified", "author", "categories"],
      initialSort: { field: "start", direction: "DESC" }
    }
  },
  fields: {
    title: (0, import_fields2.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields2.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    dateCreated: (0, import_fields2.timestamp)({ defaultValue: { kind: "now" } }),
    dateModified: (0, import_fields2.timestamp)({ defaultValue: { kind: "now" } }),
    status: (0, import_fields2.select)({
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Private", value: "PRIVATE" }
      ],
      defaultValue: "DRAFT",
      ui: {
        displayMode: "segmented-control",
        createView: { fieldMode: "edit" }
      }
    }),
    featured_image: (0, import_fields2.text)(),
    content: (0, import_fields_document.document)({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
          code: true,
          superscript: true,
          keyboard: true
        },
        listTypes: {
          ordered: true,
          unordered: true
        },
        alignment: {
          center: true,
          end: true
        },
        headingLevels: [1, 2, 3, 4, 5, 6],
        blockTypes: {
          blockquote: true,
          code: true
        },
        softBreaks: true
      },
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1]
      ],
      links: true,
      dividers: true
    }),
    author: (0, import_fields2.relationship)({
      ref: "User.blog",
      ui: {
        displayMode: "cards",
        cardFields: ["name", "email"],
        inlineEdit: { fields: ["name", "email"] },
        linkToItem: true,
        inlineConnect: true
      },
      many: false
    }),
    categories: (0, import_fields2.relationship)({
      ref: "Category.blog",
      many: true
    }),
    tags: (0, import_fields2.relationship)({
      ref: "Tag.blog",
      many: true
    }),
    photo: (0, import_fields2.relationship)({
      ref: "MediaGalery.blog",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText", "filename"],
        inlineCreate: { fields: ["image", "altText", "filename"] },
        inlineEdit: { fields: ["image", "altText", "filename"] }
      }
    }),
    language: (0, import_fields2.relationship)({
      ref: "Language.blog",
      ui: {
        displayMode: "cards",
        cardFields: ["languages"],
        inlineCreate: { fields: ["languages"] },
        inlineEdit: { fields: ["languages"] }
      }
    })
  }
});

// schemas/Users.ts
var import_core3 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");
var User = (0, import_core3.list)({
  access: import_access3.allowAll,
  ui: {},
  fields: {
    name: (0, import_fields3.text)({ validation: { isRequired: true } }),
    nameLast: (0, import_fields3.text)(),
    email: (0, import_fields3.text)({
      validation: { isRequired: true },
      isIndexed: "unique"
    }),
    password: (0, import_fields3.password)({ validation: { isRequired: true } }),
    isAdmin: (0, import_fields3.checkbox)({ defaultValue: false }),
    isActive: (0, import_fields3.checkbox)({ defaultValue: true }),
    blog: (0, import_fields3.relationship)({ ref: "Blog.author", many: true }),
    createdAt: (0, import_fields3.timestamp)({
      defaultValue: { kind: "now" }
    }),
    dateModified: (0, import_fields3.timestamp)({ defaultValue: { kind: "now" } })
  }
});

// schemas/Tag.ts
var import_core4 = require("@keystone-6/core");
var import_access4 = require("@keystone-6/core/access");
var import_fields4 = require("@keystone-6/core/fields");
var Tag = (0, import_core4.list)({
  access: import_access4.allowAll,
  fields: {
    name: (0, import_fields4.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    blog: (0, import_fields4.relationship)({ ref: "Blog.tags", many: true })
  }
});

// schemas/Category.ts
var import_core5 = require("@keystone-6/core");
var import_access5 = require("@keystone-6/core/access");
var import_fields5 = require("@keystone-6/core/fields");
var Category = (0, import_core5.list)({
  access: import_access5.allowAll,
  fields: {
    name: (0, import_fields5.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    excerpt: (0, import_fields5.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    blog: (0, import_fields5.relationship)({ ref: "Blog.categories", many: true })
  }
});

// schemas/MediaGalery.ts
var import_core6 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var import_access6 = require("@keystone-6/core/access");
var MediaGalery = (0, import_core6.list)({
  access: import_access6.allowAll,
  fields: {
    //image: cloudinaryImage({
    //   cloudinary,
    //   label:'Source'
    // }),
    image: (0, import_fields6.image)({ storage: "my_local_storage" }),
    altText: (0, import_fields6.text)(),
    filename: (0, import_fields6.text)({
      isIndexed: "unique",
      validation: {
        isRequired: true
      }
    }),
    blog: (0, import_fields6.relationship)({ ref: "Blog.photo" })
  },
  ui: {
    listView: {
      initialColumns: ["image", "altText", "product"]
    }
  }
});

// schema.ts
var lists = {
  User,
  Blog,
  Tag,
  Category,
  MediaGalery,
  Language
};

// keystone.ts
require("dotenv").config();
var DATABASE_URL = process.env.DATABASE_URL;
var DB_PROTOCOL = process.env.DB_PROTOCOL;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;
var DB_DOMAIN = process.env.DB_DOMAIN;
var DB_PORT = ":" + process.env.DB_PORT;
var DB_COLLECTION = process.env.DB_COLLECTION;
var BACKEND_URL = process.env.BACKEND_URL;
var BACKEN_PORT = process.env.BACKEND_PORT;
var FRONTEND_URL = process.env.FRONTEND_URL;
var DB_URL = DB_PROTOCOL + DB_USER + ":" + DB_PASSWORD + "@" + DB_DOMAIN + DB_PORT + "/";
console.log("\u{1F4BE} \u{1F4BE} \u{1F4BE}" + DB_URL + DB_COLLECTION);
console.log(BACKEND_URL + BACKEN_PORT);
var db = {
  provider: "mysql",
  url: DB_URL + DB_COLLECTION + "?connect_timeout=300",
  async onConnect(context) {
    console.log("--- MariaDB CONNECTED ---");
  },
  enableLogging: true,
  idField: { kind: "uuid" }
};
var keystone_default = withAuth(
  (0, import_core7.config)({
    server: {
      port: Number(BACKEN_PORT),
      cors: { origin: [FRONTEND_URL], credentials: true }
    },
    db,
    lists,
    session,
    storage: {
      my_local_storage: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `${BACKEND_URL}:${BACKEN_PORT}/assets/images${path}`,
        serverRoute: {
          path: "/assets/images"
        },
        storagePath: "public/assets/images"
      }
    }
  })
);
