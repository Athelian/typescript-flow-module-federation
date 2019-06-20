/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';

import TaskRing from './index';

storiesOf('TaskRing', module).add('default', () => (
  <TaskRing completedCount={9} remainingCount={6} />
));
