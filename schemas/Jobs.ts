import { list } from "@keystone-6/core";
import type {Lists} from '.keystone/types';
import { allowAll } from "@keystone-6/core/access";
import { calendarDay, relationship, text } from "@keystone-6/core/fields";

export const Job:Lists.Job = list({

    access: allowAll,
    
    fields:{
      title: text(),
      company: text(),
      date: calendarDay(),
      industry: text(),
      description: text(),
      requierments: text(),
      whyWork: text(),
      applyForm: relationship({
        ref: 'JobApplications',
        many: true,
      }),

    }


  }),