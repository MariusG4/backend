import { list } from "@keystone-6/core";
import type {Lists} from '.keystone/types';
import { allowAll } from "@keystone-6/core/access";
import { checkbox, password, relationship, text, timestamp } from "@keystone-6/core/fields";

export const User: Lists.User = list({
    access: allowAll,
    ui:{

    },
    fields:{
        name: text({validation:{isRequired: true}}),
        nameLast: text(),
        email: text({
            validation: {isRequired: true},
            isIndexed: 'unique',
        }),
        password: password({validation:{isRequired: true}}),
        isAdmin:checkbox({defaultValue: false}),
        isActive: checkbox({defaultValue: true}),
        blog : relationship ({ref: 'Blog.author', many: true}),
        createdAt: timestamp ({
            defaultValue:{kind: 'now'},
        }),
        dateModified: timestamp({defaultValue: { kind: 'now' },}),
    }


})