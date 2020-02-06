/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';

import QueryFormPermissionContext from 'components/common/QueryForm/context';
import DocumentMiniCard from './index';

storiesOf('Card/DocumentMiniCard', module)
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
    <DocumentMiniCard
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
        tags: [
          {
            id: 1,
            name: 'Tag A',
            color: '#AAAAAA',
          },
          {
            id: 2,
            name: 'Tag B',
            color: '#EF4848',
          },
        ],
        __typename: 'File',
      }}
    />
  ))
  .add('with file editable', () => (
    <DocumentMiniCard
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
        tags: [
          {
            id: 1,
            name: 'Tag A',
            color: '#AAAAAA',
          },
          {
            id: 2,
            name: 'Tag B',
            color: '#EF4848',
          },
        ],
        __typename: 'File',
      }}
    />
  ))
  .add('with hide parent info', () => (
    <DocumentMiniCard
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
        tags: [
          {
            id: 1,
            name: 'Tag A',
            color: '#AAAAAA',
          },
          {
            id: 2,
            name: 'Tag B',
            color: '#EF4848',
          },
        ],
        __typename: 'File',
      }}
    />
  ))
  .add('with hide parent info and non-editable', () => (
    <DocumentMiniCard
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
        tags: [
          {
            id: 1,
            name: 'Tag A',
            color: '#AAAAAA',
          },
          {
            id: 2,
            name: 'Tag B',
            color: '#EF4848',
          },
        ],
        __typename: 'File',
      }}
    />
  ))
  .add('with hide parent info and forbidden data', () => (
    <DocumentMiniCard
      onChange={console.warn}
      editable={{
        status: false,
        type: false,
        memo: false,
      }}
      downloadable
      hideParentInfo
      file={{
        __typename: 'Forbidden',
      }}
    />
  ));
