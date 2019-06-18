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
            tasks: [
              {
                completedAt: '2019-6-30',
              },
              {
                completedAt: '2019-6-30',
              },
              {
                inProgressAt: '2019-6-30',
              },
              {
                skippedAt: '2019-6-30',
              },
              {
                dueDate: '2019-1-30',
              },
              {},
            ],
          }}
        />
      </div>

      <div>
        <MilestoneCard
          milestone={{
            name: 'Milestone long long long long title',
            dueDate: '2019-6-30',
            tasks: [],
          }}
        />
      </div>
    </div>
  </IntlProvider>
));
