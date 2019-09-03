/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Provider } from 'unstated';
import { range, random } from 'lodash';
import faker from 'faker';
import { storiesOf } from '@storybook/react';
import { ProjectMilestonesContainer } from 'modules/project/form/containers';
import MilestonesSection from './index';

const entities = ['Product', 'ProductProvider', 'Order', 'OrderItem', 'Batch', 'Shipment'];

const mileStoneGenerator = () => ({
  id: faker.random.uuid(),
  dueDate: faker.date.future(),
  total: faker.random.number({ min: 0, max: 10 }),
  completed: faker.random.number({ min: 0, max: 10 }),
  isCompleted: faker.random.boolean(),
  name: faker.name.findName(),
  tasks: range(faker.random.number({ min: 5, max: 10 })).map(() => ({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    entity: {
      id: faker.random.uuid(),
      __typename: entities[random(0, entities.length - 1)],
    },
    description: faker.lorem.paragraph(),
  })),
});

const milestonesContainer = new ProjectMilestonesContainer();
milestonesContainer.initDetailValues(range(random(2, 10)).map(mileStoneGenerator));

storiesOf('Project/MilestonesSection', module).add('with default props', () => (
  <Provider inject={[milestonesContainer]}>
    <MilestonesSection />
  </Provider>
));
