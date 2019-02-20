/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ApolloProvider } from 'react-apollo';
import apolloClient from 'apollo';
import TagsInput from './index';

storiesOf('Form/TagsInput', module)
  .add('with selected value', () => (
    <ApolloProvider client={apolloClient}>
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
    </ApolloProvider>
  ))
  .add('with input style', () => (
    <ApolloProvider client={apolloClient}>
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
    </ApolloProvider>
  ))
  .add('readonly', () => (
    <ApolloProvider client={apolloClient}>
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
    </ApolloProvider>
  ))
  .add('no permission', () => (
    <form onSubmit={action('onSubmit')}>
      <TagsInput permissions="" />
    </form>
  ));
