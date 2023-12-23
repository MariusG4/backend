/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';
import { component, fields } from '@keystone-6/fields-document/component-blocks';

export const image = component({
  label: 'Image',
  schema: {

    imageCld: fields.relationship({
        label: 'Image',
        listKey: 'MediaGalery',
        selection:'image {publicUrlTransformed}',
         
   }),
    padding: fields.integer({
      label: 'Frame Padding',
      defaultValue: 20
    }),
    width: fields.integer({
      label: 'Frame Width',
      defaultValue: 75
    }),
    color: fields.text({
      label: 'Fallback background color',
      defaultValue: 'lightgray'
    }),
    
  },

  

  
  preview: function Quote(props) {
    return (
        <figure style={{
          padding: props.fields.padding.value,
          border: `solid lightgrey 10px`,
          margin: '0',
          backgroundColor: props.fields.color.value,
          backgroundImage: props.fields.imageCld.value?.data?.image?.publicUrlTransformed,
          width: '50%',
          height: 'auto',
          marginInline: 'auto',
        }}>
          <img 
            src={props.fields.imageCld.value?.data?.image?.publicUrlTransformed} 
            style={{
              width: '100%',
              objectFit: 'contain',
            }}
          />
         
        </figure>
         
    );
  },
});

