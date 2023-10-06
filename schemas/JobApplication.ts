import type {Lists} from '.keystone/types'
import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { relationship, text, timestamp } from '@keystone-6/core/fields'




export const JobApplication:Lists.JobApplication = list ({
    access:allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ 
        validation: { 
          isRequired: true, 
          match:{regex:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/},  } }),
      message: text({ validation: { isRequired: true }, 
        ui: { displayMode: 'textarea' } }),
      createdAt: timestamp({ 
        defaultValue: () => new Date().toISOString(), 
        ui: { isHidden: true,} ,
      },),
      job: relationship ({ref:'Job.applyForm',many: false }),
    },
  })