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
      category : relationship({ref:'Category.job', many:false}),
      description: text({
        ui:{displayMode:"textarea"}
      }),
      requierments: text({
        ui:{displayMode:"textarea"}
      }),
      whyWork:  text({
        ui:{displayMode:"textarea"}
      }),
      applyForm: relationship({
        ref: 'JobApplication.job',
        many: true,
      }),

    }


  })