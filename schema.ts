import { CityRO } from "./schemas/location/CityRO";
import { Country } from "./schemas/location/Country";
import { Location } from "./schemas/location/Location";
import { Role } from "./schemas/Role";
import { ContactForm } from "./schemas/forms/ContactForm";
import { JobApplication } from "./schemas/job/JobApplication";
import { Job } from "./schemas/job/Job";
import { Language } from "./schemas/Language";
import type { Lists } from ".keystone/types";
import { Blog } from "./schemas/blog/Blog";
import { User } from "./schemas/Users";
import { Tag } from "./schemas/blog/Tag";
import { Category } from "./schemas/categories/Category";
import { MediaGalery } from "./schemas/mediaGalery/MediaGalery";
import { CityIT } from "./schemas/location/CityIT";
import { SubCategory } from "./schemas/categories/SubCategory";
import { JobCategory } from "./schemas/categories/JobCategory";

export const lists: Lists = {
  User,
  Blog,
  Tag,
  Category,
  MediaGalery,
  Language,
  Job,
  JobApplication,
  ContactForm,
  Role,
  Location,
  Country,
  CityRO,
  CityIT,
  SubCategory,
  JobCategory,
};
