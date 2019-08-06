import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';

import Table from './Table';

// const order = {
//   id: 1,
//   'order.name': 'order 1',
//   'order.other': 'order 1 other fields long long long long long long long long',
//   __children: [
//     {
//       id: 1,
//       'orderItem.name': 'order item 1',
//       'orderItem.other': 'order item 1 other fields',
//       __children: [
//         {
//           id: 1,
//           'batch.name': 'batch 1',
//           'batch.other': 'batch 1 other fields',
//         },
//         {
//           id: 2,
//           'batch.name': 'batch 2',
//           'batch.other': 'batch 2 other fields',
//         },
//       ],
//     },
//     {
//       id: 2,
//       'orderItem.name': 'order item 2',
//       'orderItem.other': 'order item 2 other fields',
//       __children: [
//         {
//           id: 3,
//           'batch.name': 'batch 3',
//           'batch.other': 'batch 3 other fields',
//         },
//       ],
//     },
//   ],
// };
// const data = [order, order, order, order, order, order, order, order, order, order];

const mockObject = { key: 'any', value: 'any' };
const mockHeaderItems = Array(1000).fill('header');
const mockRow = Array(1000).fill(mockObject);
const mockData = Array(1000).fill(mockRow);

const columnWidths = mockHeaderItems.map(() => 200);

storiesOf('Modules/GlobalView', module).add('virtual list', () => (
  <div
    style={{
      height: '80vh',
      width: '80vw',
    }}
  >
    <Table columnWidths={columnWidths} keys={mockHeaderItems} data={mockData} />
  </div>
));
