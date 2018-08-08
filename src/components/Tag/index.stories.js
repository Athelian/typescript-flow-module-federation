/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Tag from './index';

storiesOf('Tag', module).add('with color and description', () => (
  <Tag
    tag={{
      color: 'red',
      description: 'test',
      name: 'Test',
    }}
  />
));
