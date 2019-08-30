/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Entities } from 'modules/relationMapV2/store';
import Header from './index';

storiesOf('RelationMapV2', module).add('Header', () => (
  <Entities.Provider>
    <Header />
  </Entities.Provider>
));
