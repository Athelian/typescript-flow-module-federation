/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';
import TaskStatus from './index';

storiesOf('Project/TaskStatus', module).add('with props', () => (
  <TaskStatus
    {...{
      count: faker.random.number(),
      completed: faker.random.number(),
      remain: faker.random.number(),
      inProgress: faker.random.number(),
      delayed: faker.random.number(),
      skipped: faker.random.number(),
      rejected: faker.random.number(),
      approved: faker.random.number(),
    }}
  />
));
