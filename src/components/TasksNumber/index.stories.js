import * as React from 'react';
import { IntlProvider } from 'react-intl';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action

import TasksNumber from './index';

storiesOf('TasksNumber', module).add('default', () => (
  <IntlProvider>
    <TasksNumber completedCount={9} remainingCount={6} />
  </IntlProvider>
));
