import { checkbox } from "@keystone-6/core/fields";

export const permissionFields = {
  canManageJobs: checkbox({
    defaultValue: false,
    label: "Manage Jobs: Can update and delete any job",
  }),
  canManageBlogs: checkbox({
    defaultValue: false,
    label: "Manage Blogs: Can update and delete any blog",
  }),
  canManageLanguages: checkbox({
    defaultValue: false,
    label: "Manage Languages: Can update and delete any langauge",
  }),
  canManageTags: checkbox({
    defaultValue: false,
    label: "Manage Tags: Can update and delete any tag",
  }),
  canManageJobApplications: checkbox({
    defaultValue: false,
    label: "Manage Job Applications: Can update and delete any job application",
  }),
  canManageContactForms: checkbox({
    defaultValue: false,
    label: "Manage Contact Forms: Can update and delete any contact form",
  }),
  canManageCategories: checkbox({
    defaultValue: false,
    label: "Manage Categorys: Can update and delete any category",
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: "View Users: Can query any User",
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: "Manage Users: Can edit any User",
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: "Manage Roles: Can create / read / update / delete any Role",
  }),
  canManageWorkerForms: checkbox({
    defaultValue: false,
    label: "Manage Worker Forms: Can see and manage any Worker Form",
  }),
  canManageEmployerForms: checkbox({
    defaultValue: false,
    label: "Manage Employer Forms: Can see and manage any Employer Form",
  }),
  canManageLocations: checkbox({
    defaultValue: false,
    label: "Manage Locations: Can see and manage any location",
  }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[];
