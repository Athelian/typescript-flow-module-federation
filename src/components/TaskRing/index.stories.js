import * as React from 'react';
import { IntlProvider } from 'react-intl';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action

import TaskRing from './index';

storiesOf('TaskRing', module).add('default', () => (
  <IntlProvider>
    <TaskRing completedCount={9} remainingCount={6} />
  </IntlProvider>
));
