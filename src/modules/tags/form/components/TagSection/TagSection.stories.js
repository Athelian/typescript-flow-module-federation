/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'unstated';
import TagSection from './index';

storiesOf('RelationMap', module).add('TagSection', () => (
  <Provider>
    <TagSection isNew />
  </Provider>
));
