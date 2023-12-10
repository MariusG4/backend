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
    color: fields.text({
      label: 'Fallback background color',
      defaultValue: 'lightgray'
    }),
    padding: fields.integer({
      label: 'Frame Padding',
      defaultValue: 20
    }),
    border: fields.integer({
      label: 'Frame Border',
      defaultValue: 0
    }),
    width: fields.integer({
      label: 'Frame Width',
      defaultValue: 100
    }),
    height: fields.integer({
      label: 'Frame Height',
      defaultValue: 100  
    })
    
  },

  

  
  preview: function Quote(props) {
    return (
        <figure style={{
          padding: props.fields.padding.value,
          border: `solid lightgrey ${props.fields.border.value}px`,
          margin: '0',
          backgroundColor: props.fields.color.value,
          backgroundImage: props.fields.imageCld.value?.data?.image?.publicUrlTransformed,
          width: props.fields.width.value + 'px',
          height: props.fields.height.value + 'px',
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

