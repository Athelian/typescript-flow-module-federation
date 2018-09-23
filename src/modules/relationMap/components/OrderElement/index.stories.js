/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import TotalCard from './TotalCard';

storiesOf('RelationMap/OrderElement', module).add('TotalCard', () => (
  <TotalCard total={10} name="Items" show onClick={() => {}} />
));
