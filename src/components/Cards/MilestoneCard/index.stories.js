import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import MilestoneCard from './index';

storiesOf('Card', module).add('Milestone Card', () => (
  <IntlProvider>
    <div
      style={{
        display: 'grid',
        gridGap: 5,
      }}
    >
      <div>
        <MilestoneCard
          milestone={{
            name: 'Milestone TITLE',
            dueDate: '2019-6-30',
            completedAt: '2019-6-30',
            taskCount: {
              count: 6,
              delayed: 1,
              completed: 2,
              inProgress: 1,
              remain: 1,
            },
          }}
        />
      </div>

      <div>
        <MilestoneCard
          milestone={{
            name: 'Milestone long long long long title',
            dueDate: '2019-6-30',
            taskCount: {
              count: 0,
              delayed: 0,
              completed: 0,
              inProgress: 0,
              remain: 0,
            },
          }}
        />
      </div>
    </div>
  </IntlProvider>
));
