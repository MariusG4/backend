import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";
import type { Lists } from '.keystone/types';

export const Category:Lists.Category = list({
    access : allowAll,
    fields:{
        name: text ({isIndexed: 'unique', validation: {isRequired: true}}),
        excerpt: text ({
            ui:{
                displayMode:'textarea'
            }
        }),
        blog : relationship({ref:'Blog.categories', many:true}),
    },
   

    
});