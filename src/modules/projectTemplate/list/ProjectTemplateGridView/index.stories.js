import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
// import { action } from '@storybook/addon-actions';

import ProjectTemplateGridView from './index';

const items = [
  {
    id: 1,
    name: 'project template 1',
    description: 'project template description',
    project: {
      id: 1,
      name: 'project name',
      milestones: [
        {
          id: 1,
          name: 'milestone 1',
        },
      ],
    },
  },
  {
    id: 2,
    name: 'project template 2',
    project: {
      id: 1,
      name: 'project name',
      milestones: [
        {
          id: 1,
          name: 'milestone 1',
        },
      ],
    },
  },
  {
    id: 3,
    name: 'project template 3',
    project: {
      id: 1,
      name: 'project name',
      milestones: [
        {
          id: 1,
          name: 'milestone 1',
        },
      ],
    },
  },
];

storiesOf('project template', module).add('list page', () => (
  <ProjectTemplateGridView items={items} onLoadMore={() => console.log('load more')} />
));
