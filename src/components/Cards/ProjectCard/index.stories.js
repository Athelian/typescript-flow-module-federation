import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
// action
// import { action } from '@storybook/addon-actions';
import ProjectCard from './index';

storiesOf('Project Card', module).add('Card', () => (
  <IntlProvider>
    <div
      style={{
        display: 'grid',
        gridGap: 5,
      }}
    >
      <div>
        <ProjectCard
          data={{
            name: 'PROJECT TITLE',
            dueDate: '2019-6-30',
            milestones: [
              {
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
              },
              {},
            ],
            taskCount: 20,
            tags: [
              { id: 1, name: 'tag1', color: '#123456' },
              { id: 2, name: 'tag2', color: '#FF00FF' },
            ],
          }}
        />
      </div>

      <div>
        <ProjectCard
          data={{
            name: 'PROJECT long long long long title',
            dueDate: '2019-6-30',
            milestones: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            taskCount: 20,
            tags: [],
          }}
        />
      </div>
    </div>
  </IntlProvider>
));
