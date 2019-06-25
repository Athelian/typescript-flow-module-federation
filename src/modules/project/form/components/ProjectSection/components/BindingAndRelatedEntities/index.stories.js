/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';
import BindingAndRelatedEntities from './index';

storiesOf('Project/BindingAndRelatedEntities', module).add('with props', () => (
  <BindingAndRelatedEntities
    binding={{
      products: faker.random.number(),
      productProviders: faker.random.number(),
      orders: faker.random.number(),
      orderItems: faker.random.number(),
      batches: faker.random.number(),
      shipments: faker.random.number(),
      containers: faker.random.number(),
    }}
    related={{
      products: faker.random.number(),
      productProviders: faker.random.number(),
      orders: faker.random.number(),
      orderItems: faker.random.number(),
      batches: faker.random.number(),
      shipments: faker.random.number(),
      containers: faker.random.number(),
    }}
  />
));
