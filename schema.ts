import { JobApplication } from './schemas/JobApplication';
import { Job } from './schemas/Job';
import { Language } from './schemas/Language';
import type { Lists } from '.keystone/types';
import { Blog } from './schemas/Blog';
import { User } from './schemas/Users';
import { Tag } from './schemas/Tag';
import { Category } from './schemas/Category';
import { MediaGalery } from './schemas/MediaGalery';



export const lists: Lists = {
  User,
  Blog,
  Tag,
  Category,
  MediaGalery,
  Language,
  Job,
  JobApplication,
};
