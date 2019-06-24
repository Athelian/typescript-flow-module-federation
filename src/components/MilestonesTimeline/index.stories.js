// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { range } from 'lodash';
import { storiesOf } from '@storybook/react';
import MilestonesTimeline from './index';

const mileStoneGenerator = () => ({
  dueDate: faker.date.future(),
  total: faker.random.number({ min: 0, max: 100 }),
  completed: faker.random.number({ min: 0, max: 100 }),
  isCompleted: faker.random.boolean(),
  name: faker.name.findName(),
});

storiesOf('MilestonesTimeline', module)
  .add('with 1 milestone with empty', () => (
    <MilestonesTimeline
      milestones={[
        {
          dueDate: null,
          total: 0,
          completed: 0,
          isCompleted: false,
          name: faker.name.findName(),
        },
      ]}
    />
  ))
  .add('with 1 milestone', () => <MilestonesTimeline milestones={[mileStoneGenerator()]} />)
  .add('with 3 milestones', () => (
    <MilestonesTimeline milestones={range(3).map(() => mileStoneGenerator())} />
  ))
  .add('with 5 milestones', () => (
    <MilestonesTimeline milestones={range(5).map(() => mileStoneGenerator())} />
  ))
  .add('with 10 milestones', () => (
    <MilestonesTimeline milestones={range(10).map(() => mileStoneGenerator())} />
  ))
  .add('with 20 milestones', () => (
    <MilestonesTimeline milestones={range(20).map(() => mileStoneGenerator())} />
  ));
