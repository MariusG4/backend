import { list } from "@keystone-6/core";
import { text, image, relationship } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import type { Lists } from ".keystone/types";


export const MediaGalery:Lists.MediaGalery = list ({
    access: allowAll,
    
    fields:{
         //image: cloudinaryImage({
         //   cloudinary,
         //   label:'Source'
         // }),

        image : image ({storage:'my_local_storage'}),
        altText: text(),
        filename:text ({
            isIndexed:'unique',
             validation:{
                isRequired: true
            }
        }),
        blog: relationship ({ref: 'Blog.photo' }),


    },
    ui:{
        listView:{
            initialColumns:['image','altText','product']
        }
    },

});