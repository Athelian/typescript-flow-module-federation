/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { range, random } from 'lodash';
import { Provider } from 'unstated';
import { storiesOf } from '@storybook/react';
import faker from 'faker';
import { ProjectInfoContainer, ProjectMilestonesContainer } from 'modules/project/form/containers';
import ProjectSection from './index';

const entities = [
  'Product',
  'ProductProvider',
  'Order',
  'OrderItem',
  'Batch',
  'Shipment',
  'Container',
];

const mileStoneGenerator = () => ({
  dueDate: faker.date.future(),
  total: faker.random.number({ min: 0, max: 100 }),
  completed: faker.random.number({ min: 0, max: 100 }),
  isCompleted: faker.random.boolean(),
  name: faker.name.findName(),
  entitiesCount: {
    products: faker.random.number(),
    productProviders: faker.random.number(),
    orders: faker.random.number(),
    orderItems: faker.random.number(),
    batches: faker.random.number(),
    shipments: faker.random.number(),
    containers: faker.random.number(),
  },
  entitiesRelatedCount: {
    products: faker.random.number(),
    productProviders: faker.random.number(),
    orders: faker.random.number(),
    orderItems: faker.random.number(),
    batches: faker.random.number(),
    shipments: faker.random.number(),
    containers: faker.random.number(),
  },
  tasks: range(faker.random.number({ min: 0, max: 100 })).map(() => ({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    entity: {
      id: faker.random.uuid(),
      __typename: entities[random(0, entities.length - 1)],
    },
    description: faker.lorem.paragraph(),
  })),
});

const infoContainer = new ProjectInfoContainer();
const milestonesContainer = new ProjectMilestonesContainer();
infoContainer.initDetailValues({
  id: faker.random.uuid(),
  name: faker.name.firstName(),
  dueDate: faker.date.future(),
  description: faker.lorem.paragraph(),
  taskCount: {
    count: faker.random.number(),
    remain: faker.random.number(),
    inProgress: faker.random.number(),
    completed: faker.random.number(),
    rejected: faker.random.number(),
    approved: faker.random.number(),
    skipped: faker.random.number(),
    delayed: faker.random.number(),
    __typename: 'TaskCount',
  },
  __typename: 'Project',
});

milestonesContainer.initDetailValues(range(random(3, 10)).map(mileStoneGenerator));

storiesOf('Project/ProjectSection', module).add('with default props', () => (
  <Provider inject={[infoContainer, milestonesContainer]}>
    <ProjectSection />
  </Provider>
));
