/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';

import QueryFormPermissionContext from 'components/common/QueryForm/context';
import DocumentCard from './index';

storiesOf('Card/DocumentCard', module)
  .addDecorator(storyFn => (
    <QueryFormPermissionContext.Provider
      value={{
        isOwner: false,
        permissions: ['order.orders.form'],
      }}
    >
      {storyFn()}
    </QueryFormPermissionContext.Provider>
  ))
  .add('with file and non-editable', () => (
    <DocumentCard
      onChange={console.warn}
      editable={{
        status: false,
        type: false,
        memo: false,
      }}
      file={{
        id: faker.random.uuid(),
        name: faker.system.commonFileName('png'),
        type: 'Document',
        status: 'Draft',
        entity: {
          id: faker.random.uuid(),
          poNo: faker.name.findName(),
          __typename: 'Order',
        },
        memo: faker.lorem.sentence(),
        createdAt: faker.date.future(),
        updatedAt: faker.date.future(),
        __typename: 'File',
      }}
    />
  ))
  .add('with file editable', () => (
    <DocumentCard
      onChange={console.warn}
      editable={{
        status: true,
        type: true,
        memo: true,
      }}
      file={{
        id: faker.random.uuid(),
        name: faker.system.commonFileName('pdf'),
        type: 'Document',
        status: 'Draft',
        entity: {
          id: faker.random.uuid(),
          poNo: faker.name.findName(),
          __typename: 'Order',
        },
        memo: faker.lorem.sentence(),
        createdAt: faker.date.future(),
        updatedAt: faker.date.future(),
        __typename: 'File',
      }}
    />
  ))
  .add('with hide parent info', () => (
    <DocumentCard
      onChange={console.warn}
      editable={{
        status: true,
        type: true,
        memo: true,
      }}
      hideParentInfo
      file={{
        id: faker.random.uuid(),
        name: faker.system.commonFileName('pdf'),
        type: 'Document',
        status: 'Draft',
        entity: {
          id: faker.random.uuid(),
          poNo: faker.name.findName(),
          __typename: 'Order',
        },
        memo: faker.lorem.sentence(),
        createdAt: faker.date.future(),
        updatedAt: faker.date.future(),
        __typename: 'File',
      }}
    />
  ))
  .add('with hide parent info and non-editable', () => (
    <DocumentCard
      onChange={console.warn}
      editable={{
        status: false,
        type: false,
        memo: false,
      }}
      downloadable
      hideParentInfo
      file={{
        id: faker.random.uuid(),
        name: faker.system.commonFileName('pdf'),
        type: 'Document',
        status: 'Draft',
        entity: {
          id: faker.random.uuid(),
          poNo: faker.name.findName(),
          __typename: 'Order',
        },
        memo: '',
        createdAt: faker.date.future(),
        updatedAt: faker.date.future(),
        __typename: 'File',
      }}
    />
  ));
