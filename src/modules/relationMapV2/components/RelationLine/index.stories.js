/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import RelationLine from './index';

storiesOf('RelationMapV2', module).add('RelationLine', () => (
  <div>
    Type 0: <RelationLine type={0} isFocus /> <br /> <br /> <br /> <br />
    Type 1: <RelationLine type={1} isFocus /> <br /> <br /> <br /> <br />
    Type 2: <RelationLine type={2} isFocus /> <br /> <br /> <br /> <br />
    Type 3: <RelationLine type={3} isFocus /> <br /> <br /> <br /> <br />
    Type 4: <RelationLine type={4} isFocus /> <br /> <br /> <br /> <br />
  </div>
));
