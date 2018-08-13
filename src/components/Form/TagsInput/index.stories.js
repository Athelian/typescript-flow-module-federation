/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TagsInput from './index';

storiesOf('Form/TagsInput', module)
  .add('with selected value', () => (
    <form onSubmit={action('submit')}>
      <TagsInput
        tags={[
          {
            id: 1,
            name: 'Tag',
            description: '',
            color: '#ccc',
          },
          {
            id: 2,
            name: 'Tag 2',
            description: '',
            color: '#ccc',
          },
          {
            id: 3,
            name: 'Tag 3',
            description: '',
            color: '#ccc',
          },
        ]}
        name="tags"
        value={[
          {
            id: 1,
            name: 'Tag',
            description: '',
            color: '#ccc',
          },
        ]}
        label="Tag Inputs"
        permissions="rw"
        onChange={action('onChange')}
        onBlur={action('onBlur')}
      />
    </form>
  ))
  .add('with input style', () => (
    <form onSubmit={action('onSubmit')}>
      <TagsInput
        editable
        tags={[
          {
            id: 1,
            name: 'Tag',
            description: '',
            color: '#ccc',
          },
          {
            id: 2,
            name: 'Tag 2',
            description: '',
            color: '#ccc',
          },
          {
            id: 3,
            name: 'Tag 3',
            description: '',
            color: '#ccc',
          },
        ]}
        name="tags"
        value={[
          {
            id: 1,
            name: 'Tag',
            description: '',
            color: '#ccc',
          },
        ]}
        label="Tag Inputs"
      />
    </form>
  ))
  .add('readonly', () => (
    <form onSubmit={action('onSubmit')}>
      <TagsInput
        permissions="r"
        tags={[
          {
            id: 1,
            name: 'Tag',
            description: '',
            color: '#ccc',
          },
          {
            id: 2,
            name: 'Tag 2',
            description: '',
            color: '#ccc',
          },
          {
            id: 3,
            name: 'Tag 3',
            description: '',
            color: '#ccc',
          },
        ]}
        name="tags"
        value={[
          {
            id: 1,
            name: 'Tag',
            description: '',
            color: '#ccc',
          },
        ]}
        label="Tag Inputs"
      />
    </form>
  ))
  .add('no permission', () => (
    <form onSubmit={action('onSubmit')}>
      <TagsInput permissions="" />
    </form>
  ));
