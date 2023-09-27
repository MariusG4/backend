
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";
import type {Lists} from '.keystone/types'


export const Tag:Lists.Tag = list ({
    access: allowAll,
    fields:{
        name: text ({isIndexed:'unique', validation:{isRequired: true}}),
        blog: relationship ({ref:'Blog.tags', many: true}),

    },
})