import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import ProjectCard from './index';

storiesOf('Card', module).add('Project Card', () => (
  <IntlProvider>
    <div
      style={{
        display: 'grid',
        gridGap: 5,
      }}
    >
      <div>
        <ProjectCard
          project={{
            name: 'PROJECT TITLE',
            dueDate: '2019-6-30',
            taskCount: {
              count: 20,
              remain: 1,
              inProgress: 2,
              completed: 2,
              rejected: 2,
              approved: 2,
              delayed: 2,
            },
            tags: [
              { id: 1, name: 'tag1', color: '#123456' },
              { id: 2, name: 'tag2', color: '#FF00FF' },
              { id: 3, name: 'tag2', color: '#FF00FF' },
              { id: 4, name: 'tag2', color: '#FF00FF' },
              { id: 5, name: 'tag2', color: '#FF00FF' },
            ],
          }}
        />
      </div>

      <div>
        <ProjectCard
          project={{
            name: 'PROJECT long long long long title',
            dueDate: '2019-6-30',
            taskCount: {
              taskCount: {
                count: 20,
                remain: 1,
                inProgress: 2,
                completed: 2,
                delayed: 2,
              },
            },
            tags: [],
          }}
        />
      </div>
    </div>
  </IntlProvider>
));
