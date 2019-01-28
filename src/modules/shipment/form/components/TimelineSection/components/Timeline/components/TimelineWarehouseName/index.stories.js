/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import TimelineWarehouseName from './index';

storiesOf('Timeline', module).add('TimelineWarehouseName', () => (
  <div>
    <div> vertical</div>
    <TimelineWarehouseName name="wareho" vertical containers={[]} />
    <TimelineWarehouseName name="short" vertical containers={[1, 2, 3]} />

    <TimelineWarehouseName name="wadfdfdfdfdfddfdfre" vertical containers={[]} />
    <TimelineWarehouseName name="wadfdfdfdfdfddfdfre" vertical containers={[1, 2, 3]} />
    <div> horizontal </div>
    <TimelineWarehouseName name="wadfdfdfdfdfddfdfre" containers={[]} />
    <TimelineWarehouseName name="wadfdfdfdfdfddfdfre" containers={[1, 2, 3]} />
  </div>
));
