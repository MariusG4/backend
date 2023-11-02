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
var import_core21 = require("@keystone-6/core");

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");

// lib/mail.ts
var import_nodemailer = require("nodemailer");
var transport = (0, import_nodemailer.createTransport)({
  //@ts-ignore
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
function makeNiceEmail(text19) {
  return `
    <div style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
    <h2>Hello There!</h2>
    <p>${text19}</p>
    <p>\u{1F618}, Humansource</p>
    </div>
    `;
}
async function sendPasswordResetEmail(resetToken, to) {
  const info = await transport.sendMail({
    to,
    from: "backend@humansource.ro",
    subject: "Your password reset token!",
    html: makeNiceEmail(`Your Password Reset Token is here!
        <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to Reset</a>
        `)
  });
  console.log(info);
}

// schemas/permissions.ts
var import_fields = require("@keystone-6/core/fields");
var permissionFields = {
  canManageJobs: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Jobs: Can update and delete any job"
  }),
  canManageBlogs: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Blogs: Can update and delete any blog"
  }),
  canManageLanguages: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Languages: Can update and delete any langauge"
  }),
  canManageTags: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Tags: Can update and delete any tag"
  }),
  canManageJobApplications: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Job Applications: Can update and delete any job application"
  }),
  canManageContactForms: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Contact Forms: Can update and delete any contact form"
  }),
  canManageCategories: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Categorys: Can update and delete any category"
  }),
  canSeeOtherUsers: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "View Users: Can query any User"
  }),
  canManageUsers: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Users: Can edit any User"
  }),
  canManageRoles: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Roles: Can create / read / update / delete any Role"
  }),
  canManageWorkerForms: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Worker Forms: Can see and manage any Worker Form"
  }),
  canManageEmployerForms: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Employer Forms: Can see and manage any Employer Form"
  }),
  canManageLocations: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "Manage Locations: Can see and manage any location"
  })
};
var permissionsList = Object.keys(
  permissionFields
);

// auth.ts
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var db = {
  provider: "mysql",
  url: process.env.DATABASE_URL
};
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: `name createdAt isAdmin role { id name ${permissionsList.join(
    " "
  )}}`,
  secretField: "password",
  passwordResetLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
      await sendPasswordResetEmail(token, identity);
    },
    tokensValidForMins: 60
  },
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

// schemas/forms/TransportForm.ts
var import_core = require("@keystone-6/core");
var import_fields2 = require("@keystone-6/core/fields");

// access.ts
function isSignedIn({ session: session2 }) {
  return !!session2;
}
var generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function({ session: session2 }) {
      return !!session2?.data.role?.[permission];
    }
  ])
);
var permissions = {
  ...generatedPermissions
};
var rules = {
  canManageBlogs({ session: session2 }) {
    if (!isSignedIn({ session: session2 })) {
      return false;
    }
    if (permissions.canManageBlogs({ session: session2 })) {
      return true;
    }
    return { author: { id: { equals: session2?.itemId } } };
  },
  canManageUsers({ session: session2 }) {
    if (!isSignedIn({ session: session2 })) {
      return false;
    }
    if (permissions.canManageUsers({ session: session2 })) {
      return true;
    }
    return { id: { equals: session2?.itemId } };
  },
  canManageJobs({ session: session2 }) {
    if (!isSignedIn({ session: session2 })) {
      return false;
    }
    if (permissions.canManageJobs({ session: session2 })) {
      return true;
    }
    return { user: { id: { equals: session2?.itemId } } };
  },
  canManageJobApplications({ session: session2 }) {
    if (!isSignedIn({ session: session2 })) {
      return false;
    }
    if (permissions.canManageJobApplications({ session: session2 })) {
      return true;
    }
    return { job: { user: { id: { equals: session2?.itemId } } } };
  },
  canSeeUser({ session: session2 }) {
    if (!isSignedIn({ session: session2 })) {
      return false;
    }
    if (permissions.canSeeOtherUsers({ session: session2 })) {
      return true;
    }
    return { blog: { author: { id: { equals: session2?.itemId } } } };
  }
};

// schemas/forms/TransportForm.ts
var TransportForm = (0, import_core.list)({
  access: {
    operation: {
      query: permissions.canManageWorkerForms,
      create: () => true,
      update: permissions.canManageWorkerForms,
      delete: permissions.canManageWorkerForms
    }
  },
  fields: {
    domeniu: (0, import_fields2.text)({ validation: { isRequired: true } }),
    subDomeniu: (0, import_fields2.text)({ validation: { isRequired: true } }),
    experienta: (0, import_fields2.text)({ validation: { isRequired: true } }),
    locatia: (0, import_fields2.text)({ validation: { isRequired: true } }),
    tahograf: (0, import_fields2.text)({ validation: { isRequired: true } }),
    echipa: (0, import_fields2.text)({ validation: { isRequired: true } }),
    turaNoapte: (0, import_fields2.text)({ validation: { isRequired: true } }),
    experientaLimba: (0, import_fields2.text)({ validation: { isRequired: true } }),
    ultimuSalar: (0, import_fields2.integer)({ validation: { isRequired: true } }),
    salariuDorit: (0, import_fields2.integer)({ validation: { isRequired: true } })
  }
});

// schemas/forms/MedicalForm.ts
var import_core2 = require("@keystone-6/core");
var import_fields3 = require("@keystone-6/core/fields");
var MedicalForm = (0, import_core2.list)({
  access: {
    operation: {
      query: permissions.canManageWorkerForms,
      create: () => true,
      update: permissions.canManageWorkerForms,
      delete: permissions.canManageWorkerForms
    }
  },
  fields: {
    domeniu: (0, import_fields3.text)({ validation: { isRequired: true } }),
    subDomeniu: (0, import_fields3.text)({ validation: { isRequired: true } }),
    experienta: (0, import_fields3.text)({ validation: { isRequired: true } }),
    bac: (0, import_fields3.text)({ validation: { isRequired: true } }),
    amg: (0, import_fields3.text)({ validation: { isRequired: true } }),
    absolvire: (0, import_fields3.text)({ validation: { isRequired: true } }),
    experientaLimba: (0, import_fields3.text)({ validation: { isRequired: true } }),
    locatia: (0, import_fields3.text)({ validation: { isRequired: true } }),
    ultimuSalar: (0, import_fields3.integer)({ validation: { isRequired: true } }),
    cursItaliana: (0, import_fields3.text)({ validation: { isRequired: true } })
  }
});

// schemas/location/CityRO.ts
var import_core3 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var CityRO = (0, import_core3.list)({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageLocations,
      create: permissions.canManageLocations,
      delete: permissions.canManageLocations
    }
  },
  fields: {
    name: (0, import_fields4.text)({
      validation: { isRequired: true }
    }),
    createdAt: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" },
      validation: { isRequired: true },
      isIndexed: true
    })
  }
});

// schemas/location/Country.ts
var import_core4 = require("@keystone-6/core");
var import_fields5 = require("@keystone-6/core/fields");
var Country = (0, import_core4.list)({
  access: {
    operation: {
      create: () => true,
      query: permissions.canManageLocations,
      update: permissions.canManageLocations,
      delete: permissions.canManageLocations
    }
  },
  fields: {
    name: (0, import_fields5.text)({
      validation: {
        isRequired: true
      }
    })
  }
});

// schemas/location/Location.ts
var import_core5 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var Location = (0, import_core5.list)({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageLocations,
      update: permissions.canManageLocations,
      delete: permissions.canManageLocations
    }
  },
  fields: {
    name: (0, import_fields6.text)(),
    country: (0, import_fields6.relationship)({
      ref: "Country",
      many: true,
      ui: {
        displayMode: "select",
        labelField: "name"
      }
    }),
    //create a virtual field that returns the city names from the country relationship
    cityRO: (0, import_fields6.relationship)({
      ref: "CityRO",
      many: true,
      ui: {
        displayMode: "select",
        labelField: "name",
        searchFields: ["name"]
      }
    }),
    cityIT: (0, import_fields6.relationship)({
      ref: "CityIT",
      many: true,
      ui: {
        displayMode: "select",
        labelField: "name",
        searchFields: ["name"]
      }
    }),
    zone: (0, import_fields6.select)({
      type: "string",
      options: [
        { label: "Local", value: "Local" },
        { label: "International", value: "International" },
        { label: "Tur-retur", value: "Tur-retur" }
      ]
    }),
    jobs: (0, import_fields6.relationship)({
      ref: "Job.location",
      many: true
    })
  }
});

// schemas/Role.ts
var import_fields7 = require("@keystone-6/core/fields");
var import_core6 = require("@keystone-6/core");
var Role = (0, import_core6.list)({
  access: {
    operation: {
      query: permissions.canManageRoles,
      create: permissions.canManageRoles,
      update: permissions.canManageRoles,
      delete: permissions.canManageRoles
    }
  },
  fields: {
    name: (0, import_fields7.text)({
      validation: { isRequired: true }
    }),
    ...permissionFields,
    assignedTo: (0, import_fields7.relationship)({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/forms/ContactForm.ts
var import_core7 = require("@keystone-6/core");
var import_fields8 = require("@keystone-6/core/fields");
var ContactForm = (0, import_core7.list)({
  access: {
    operation: {
      query: permissions.canManageContactForms,
      create: () => true,
      update: permissions.canManageContactForms,
      delete: permissions.canManageContactForms
    }
  },
  fields: {
    name: (0, import_fields8.text)({
      validation: {
        isRequired: true
      }
    }),
    email: (0, import_fields8.text)({
      validation: {
        isRequired: true,
        match: { regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ }
      }
    }),
    phone: (0, import_fields8.text)({
      validation: {
        isRequired: true,
        match: { regex: /^\d{1,3}\s?\d{1,14}$/ }
      }
    }),
    message: (0, import_fields8.text)({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" }
    })
  }
});

// schemas/job/JobApplication.ts
var import_core8 = require("@keystone-6/core");
var import_fields9 = require("@keystone-6/core/fields");
var JobApplication = (0, import_core8.list)({
  access: {
    operation: {
      query: permissions.canManageJobApplications,
      create: () => true,
      update: permissions.canManageJobApplications,
      delete: permissions.canManageJobApplications
    },
    filter: {
      query: rules.canManageJobApplications,
      update: rules.canManageJobApplications,
      delete: rules.canManageJobApplications
      //create: () => true,
    }
  },
  fields: {
    name: (0, import_fields9.text)({ validation: { isRequired: true } }),
    email: (0, import_fields9.text)({
      validation: {
        isRequired: true,
        match: { regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ }
      }
    }),
    message: (0, import_fields9.text)({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" }
    }),
    birthDate: (0, import_fields9.calendarDay)({
      validation: { isRequired: true }
    }),
    phone: (0, import_fields9.text)({
      validation: {
        isRequired: true,
        match: { regex: /^\d{1,3}\s?\d{1,14}$/ }
      }
    }),
    createdAt: (0, import_fields9.timestamp)({
      defaultValue: { kind: "now" },
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" }
      }
    }),
    job: (0, import_fields9.relationship)({ ref: "Job.applyForm", many: false })
  }
});

// schemas/job/Job.ts
var import_core9 = require("@keystone-6/core");
var import_fields10 = require("@keystone-6/core/fields");
var Job = (0, import_core9.list)({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageJobs,
      create: permissions.canManageJobs,
      delete: permissions.canManageJobs
    },
    filter: {
      query: () => true,
      create: rules.canManageJobs,
      update: rules.canManageJobs,
      delete: rules.canManageJobs
    }
  },
  fields: {
    title: (0, import_fields10.text)({
      validation: {
        isRequired: true
      }
    }),
    company: (0, import_fields10.text)({
      validation: {
        isRequired: true
      }
    }),
    salary: (0, import_fields10.text)({
      validation: {
        isRequired: true,
        match: { regex: /^\d+(?:\.\d+)?€?$/ }
      }
    }),
    date: (0, import_fields10.calendarDay)(),
    jobCategory: (0, import_fields10.relationship)({
      ref: "JobCategory.jobs",
      many: false
    }),
    location: (0, import_fields10.relationship)({
      ref: "Location.jobs",
      many: false,
      ui: {
        displayMode: "select",
        labelField: "name"
      }
    }),
    description: (0, import_fields10.text)({
      ui: { displayMode: "textarea" }
    }),
    requierments: (0, import_fields10.text)({
      ui: { displayMode: "textarea" }
    }),
    whyWork: (0, import_fields10.text)({
      ui: { displayMode: "textarea" }
    }),
    applyForm: (0, import_fields10.relationship)({
      ref: "JobApplication.job",
      many: true,
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" }
      }
    }),
    language: (0, import_fields10.relationship)({
      ref: "Language.job",
      many: false,
      ui: {
        hideCreate: true,
        displayMode: "select",
        labelField: "languages"
      }
    }),
    user: (0, import_fields10.relationship)({
      ref: "User.job",
      many: false,
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" }
      }
    })
  },
  hooks: {
    beforeOperation: async ({ operation, resolvedData, context, item }) => {
      try {
        if (resolvedData && !resolvedData.user) {
          const currentUserId = await context.session.itemId;
          resolvedData.user = { connect: { id: currentUserId } };
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
});

// schemas/Language.ts
var import_core10 = require("@keystone-6/core");
var import_fields11 = require("@keystone-6/core/fields");
var Language = (0, import_core10.list)({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageLanguage,
      update: permissions.canManageLanguage,
      delete: permissions.canManageLanguage
    }
  },
  fields: {
    languages: (0, import_fields11.select)({
      type: "string",
      options: [
        { label: "IT", value: "IT" },
        { label: "RO", value: "RO" }
      ],
      defaultValue: "RO",
      validation: { isRequired: true },
      isIndexed: "unique",
      ui: {
        displayMode: "segmented-control",
        createView: { fieldMode: "edit" }
      }
    }),
    blog: (0, import_fields11.relationship)({ ref: "Blog.language", many: true }),
    job: (0, import_fields11.relationship)({ ref: "Job.language", many: true })
  }
});

// schemas/blog/Blog.ts
var import_core12 = require("@keystone-6/core");
var import_fields12 = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");

// blocks/image.tsx
var import_core11 = require("@keystone-ui/core");
var import_component_blocks = require("@keystone-6/fields-document/component-blocks");
var image = (0, import_component_blocks.component)({
  label: "Image",
  schema: {
    imageCld: import_component_blocks.fields.relationship({
      label: "Image",
      listKey: "MediaGalery",
      selection: "id "
    }),
    imageSrc: import_component_blocks.fields.url({
      label: "Image URL",
      defaultValue: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
    }),
    color: import_component_blocks.fields.text({
      label: "Fallback background color",
      defaultValue: "lightgray"
    }),
    padding: import_component_blocks.fields.integer({
      label: "Frame Padding",
      defaultValue: 20
    }),
    border: import_component_blocks.fields.integer({
      label: "Frame Border",
      defaultValue: 0
    }),
    width: import_component_blocks.fields.integer({
      label: "Frame Width",
      defaultValue: 500
    })
  },
  preview: function Quote(props) {
    return /* @__PURE__ */ (0, import_core11.jsx)("figure", { style: {
      padding: props.fields.padding.value,
      border: `solid lightgrey ${props.fields.border.value}px`,
      margin: "0",
      backgroundColor: props.fields.color.value,
      backgroundImage: props.fields.imageSrc.value,
      width: props.fields.width.value + "px",
      marginInline: "auto"
    } }, /* @__PURE__ */ (0, import_core11.jsx)(
      "img",
      {
        src: props.fields.imageSrc.value,
        style: {
          width: "100%",
          objectFit: "contain"
        }
      }
    ));
  }
});

// blocks/index.tsx
var componentBlocks = {
  image
};

// schemas/blog/Blog.ts
var Blog = (0, import_core12.list)({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageBlogs,
      create: permissions.canManageBlogs,
      delete: permissions.canManageBlogs
    },
    filter: {
      query: () => true,
      update: rules.canManageBlogs,
      delete: rules.canManageBlogs
    }
  },
  ui: {
    listView: {
      initialColumns: [
        "title",
        "status",
        "dateModified",
        "author",
        "categories"
      ],
      initialSort: { field: "start", direction: "DESC" }
    }
  },
  fields: {
    title: (0, import_fields12.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields12.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    dateCreated: (0, import_fields12.timestamp)({ defaultValue: { kind: "now" } }),
    dateModified: (0, import_fields12.timestamp)({ defaultValue: { kind: "now" } }),
    status: (0, import_fields12.select)({
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
    featured_image: (0, import_fields12.text)(),
    content: (0, import_fields_document.document)({
      componentBlocks,
      ui: {
        views: "./blocks"
      },
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
    author: (0, import_fields12.relationship)({
      ref: "User.blog",
      many: false,
      access: {
        read: () => true
      }
    }),
    categories: (0, import_fields12.relationship)({
      ref: "Category.blog",
      many: true
    }),
    tags: (0, import_fields12.relationship)({
      ref: "Tag.blog",
      many: true
    }),
    photo: (0, import_fields12.relationship)({
      ref: "MediaGalery.blog",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText", "filename"],
        inlineCreate: { fields: ["image", "altText", "filename"] },
        inlineEdit: { fields: ["image", "altText", "filename"] },
        inlineConnect: true
      }
    }),
    language: (0, import_fields12.relationship)({
      ref: "Language.blog",
      ui: {
        hideCreate: true,
        displayMode: "select",
        labelField: "languages"
      },
      many: false
    })
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
    }
  }
});

// schemas/Users.ts
var import_core13 = require("@keystone-6/core");
var import_fields13 = require("@keystone-6/core/fields");
var User = (0, import_core13.list)({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageUsers,
      update: permissions.canManageUsers,
      delete: permissions.canManageUsers
    }
  },
  ui: {},
  fields: {
    name: (0, import_fields13.text)({
      validation: { isRequired: true },
      access: {
        read: () => true
      }
    }),
    nameLast: (0, import_fields13.text)(),
    email: (0, import_fields13.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      access: {
        read: permissions.canManageUsers
      }
    }),
    password: (0, import_fields13.password)({ validation: { isRequired: true } }),
    isAdmin: (0, import_fields13.checkbox)({ defaultValue: false }),
    isActive: (0, import_fields13.checkbox)({ defaultValue: true }),
    blog: (0, import_fields13.relationship)({
      ref: "Blog.author",
      many: true,
      access: {
        read: () => true
      }
    }),
    job: (0, import_fields13.relationship)({ ref: "Job.user" }),
    role: (0, import_fields13.relationship)({
      ref: "Role.assignedTo",
      many: false,
      access: {
        read: permissions.canManageRoles
      }
    }),
    createdAt: (0, import_fields13.timestamp)({
      defaultValue: { kind: "now" }
    }),
    dateModified: (0, import_fields13.timestamp)({ defaultValue: { kind: "now" } })
  }
});

// schemas/blog/Tag.ts
var import_core14 = require("@keystone-6/core");
var import_fields14 = require("@keystone-6/core/fields");
var Tag = (0, import_core14.list)({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageTags,
      update: permissions.canManageTags,
      delete: permissions.canManageTags
    }
  },
  fields: {
    name: (0, import_fields14.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    blog: (0, import_fields14.relationship)({ ref: "Blog.tags", many: true })
  }
});

// schemas/categories/Category.ts
var import_core15 = require("@keystone-6/core");
var import_fields15 = require("@keystone-6/core/fields");
var Category = (0, import_core15.list)({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageCategories,
      update: permissions.canManageCategories,
      delete: permissions.canManageCategories
    }
  },
  fields: {
    name: (0, import_fields15.text)({ validation: { isRequired: true } }),
    excerpt: (0, import_fields15.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    blog: (0, import_fields15.relationship)({ ref: "Blog.categories", many: true }),
    jobCategories: (0, import_fields15.relationship)({ ref: "JobCategory.category", many: true })
  }
});

// schemas/mediaGalery/MediaGalery.ts
var import_core16 = require("@keystone-6/core");
var import_fields16 = require("@keystone-6/core/fields");
var import_cloudinary = require("@keystone-6/cloudinary");
require("dotenv").config();
var cloudinary = {
  cloudName: process.env.CLOUDINARY_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: process.env.CLOUDINARY_API_FOLDER
};
var cloudname = process.env.CLOUDINARY_NAME;
console.log(cloudname + "\u{1F44D}\u{1F3FD} Cloudinary is configured");
var MediaGalery = (0, import_core16.list)({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageProducts,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts
    }
  },
  fields: {
    image: (0, import_cloudinary.cloudinaryImage)({
      cloudinary,
      label: "Source"
    }),
    //image : image ({storage:'my_local_storage'}),
    altText: (0, import_fields16.text)(),
    filename: (0, import_fields16.text)({
      isIndexed: "unique",
      validation: {
        isRequired: true
      }
    }),
    blog: (0, import_fields16.relationship)({
      ref: "Blog.photo"
    })
  },
  ui: {
    listView: {
      initialColumns: ["image", "altText", "product"]
    }
  }
});

// schemas/location/CityIT.ts
var import_core17 = require("@keystone-6/core");
var import_fields17 = require("@keystone-6/core/fields");
var CityIT = (0, import_core17.list)({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageLocations,
      create: permissions.canManageLocations,
      delete: permissions.canManageLocations
    }
  },
  fields: {
    name: (0, import_fields17.text)({
      validation: { isRequired: true }
    }),
    createdAt: (0, import_fields17.timestamp)({
      defaultValue: { kind: "now" },
      validation: { isRequired: true },
      isIndexed: true
    })
  }
});

// schemas/categories/SubCategory.ts
var import_fields18 = require("@keystone-6/core/fields");
var import_core18 = require("@keystone-6/core");
var SubCategory = (0, import_core18.list)({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageCategories,
      update: permissions.canManageCategories,
      delete: permissions.canManageCategories
    }
  },
  fields: {
    name: (0, import_fields18.text)(),
    category: (0, import_fields18.relationship)({
      ref: "Category",
      many: false
    })
  }
});

// schemas/categories/JobCategory.ts
var import_core19 = require("@keystone-6/core");
var import_fields19 = require("@keystone-6/core/fields");
var JobCategory = (0, import_core19.list)({
  access: {
    operation: {
      query: () => true,
      update: permissions.canManageCategories,
      create: permissions.canManageCategories,
      delete: permissions.canManageCategories
    }
  },
  fields: {
    name: (0, import_fields19.text)({
      validation: {
        isRequired: true
      }
    }),
    category: (0, import_fields19.relationship)({
      ref: "Category.jobCategories",
      many: false
    }),
    subcategories: (0, import_fields19.relationship)({
      ref: "SubCategory",
      many: true
    }),
    jobs: (0, import_fields19.relationship)({
      ref: "Job.jobCategory",
      many: true
    })
  }
});

// schemas/forms/EmployerForm.ts
var import_core20 = require("@keystone-6/core");
var import_fields20 = require("@keystone-6/core/fields");
var EmployerForm = (0, import_core20.list)({
  access: {
    operation: {
      query: permissions.canManageEmployerForms,
      create: () => true,
      update: permissions.canManageEmployerForms,
      delete: permissions.canManageEmployerForms
    }
  },
  fields: {
    domeniu: (0, import_fields20.text)({ validation: { isRequired: true } }),
    subDomeniu: (0, import_fields20.text)({ validation: { isRequired: true } }),
    codFiscal: (0, import_fields20.text)({ validation: { isRequired: true } }),
    nrPersoane: (0, import_fields20.text)({ validation: { isRequired: true } }),
    dateContact: (0, import_fields20.text)({ validation: { isRequired: true } }),
    email: (0, import_fields20.text)({ validation: { isRequired: true } }),
    nrTel: (0, import_fields20.integer)({ validation: { isRequired: true } })
  }
});

// schema.ts
var lists = {
  User,
  Blog,
  Tag,
  Category,
  SubCategory,
  JobCategory,
  Job,
  JobApplication,
  MediaGalery,
  Language,
  ContactForm,
  MedicalForm,
  TransportForm,
  EmployerForm,
  Role,
  Location,
  Country,
  CityRO,
  CityIT
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
var MAIL_HOST = process.env.MAIL_HOST;
var DB_URL = DB_PROTOCOL + DB_USER + ":" + DB_PASSWORD + "@" + DB_DOMAIN + DB_PORT + "/";
console.log("\u{1F4BE} \u{1F4BE} \u{1F4BE}" + DB_URL + DB_COLLECTION);
console.log(BACKEND_URL + BACKEN_PORT);
console.log(FRONTEND_URL);
console.log(MAIL_HOST);
var db2 = {
  provider: "mysql",
  url: DB_URL + DB_COLLECTION + "?connect_timeout=300",
  async onConnect(context) {
    console.log("--- MariaDB CONNECTED ---");
  },
  enableLogging: true,
  idField: { kind: "uuid" }
};
var keystone_default = withAuth(
  (0, import_core21.config)({
    server: {
      port: Number(BACKEN_PORT),
      cors: { origin: [FRONTEND_URL], credentials: true }
    },
    db: db2,
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
//# sourceMappingURL=config.js.map
