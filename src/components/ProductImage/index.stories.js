/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import ProductImage from './index';

storiesOf('ProductImage', module)
  .add('with forbidden image', () => (
    <ProductImage
      file={{
        __typename: 'Forbidden',
      }}
    />
  ))
  .add('with not found image', () => (
    <ProductImage
      file={{
        name: 'test',
      }}
    />
  ));
