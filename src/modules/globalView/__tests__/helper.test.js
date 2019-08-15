import { transferOrder } from '../helper';

it('order without orderItem, should return 1 line', () => {
  const order = {
    id: 1,
    name: 'order 1 name',
    others: 'order 1 others',
  };

  const result = [
    [
      {
        key: 'order.1.name',
        value: 'order 1 name',
        lines: 1,
      },
      {
        key: 'order.1.others',
        value: 'order 1 others',
        lines: 1,
      },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  ];
  expect(transferOrder(order)).toStrictEqual(result);
});

it('order with 2 items, 2 batches, should return 3 lines', () => {
  const order = {
    id: 1,
    name: 'order 1 name',
    others: 'order 1 others',
    orderItems: [
      {
        id: 1,
        name: 'orderItem 1 name',
        others: 'orderItem 1 others',
      },
      {
        id: 2,
        name: 'orderItem 2 name',
        others: 'orderItem 2 others',
        batches: [
          {
            id: 1,
            name: 'batch 1 name',
            others: 'batch 1 others',
          },
          {
            id: 2,
            name: 'batch 2 name',
            others: 'batch 2 others',
          },
        ],
      },
    ],
  };

  const result = [
    [
      {
        key: 'order.1.name',
        value: 'order 1 name',
        lines: 3,
      },
      {
        key: 'order.1.others',
        value: 'order 1 others',
        lines: 3,
      },
      {
        key: 'orderItem.1.name',
        value: 'orderItem 1 name',
        lines: 1,
      },
      {
        key: 'orderItem.1.others',
        value: 'orderItem 1 others',
        lines: 1,
      },
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      {
        key: 'order.1.name',
        value: 'order 1 name',
        lines: 3,
      },
      {
        key: 'order.1.others',
        value: 'order 1 others',
        lines: 3,
      },
      {
        key: 'orderItem.2.name',
        value: 'orderItem 2 name',
        lines: 2,
      },
      {
        key: 'orderItem.2.others',
        value: 'orderItem 2 others',
        lines: 2,
      },
      {
        key: 'batch.1.name',
        value: 'batch 1 name',
        lines: 1,
      },
      {
        key: 'batch.1.others',
        value: 'batch 1 others',
        lines: 1,
      },
      null,
      null,
      null,
      null,
    ],
    [
      {
        key: 'order.1.name',
        value: 'order 1 name',
        lines: 3,
      },
      {
        key: 'order.1.others',
        value: 'order 1 others',
        lines: 3,
      },
      {
        key: 'orderItem.2.name',
        value: 'orderItem 2 name',
        lines: 2,
      },
      {
        key: 'orderItem.2.others',
        value: 'orderItem 2 others',
        lines: 2,
      },
      {
        key: 'batch.2.name',
        value: 'batch 2 name',
        lines: 1,
      },
      {
        key: 'batch.2.others',
        value: 'batch 2 others',
        lines: 1,
      },
      null,
      null,
      null,
      null,
    ],
  ];

  expect(transferOrder(order)).toStrictEqual(result);
});

// it('transfer the order should return 4 items', () => {
//   const order = {
//     id: 1,
//     name: 'order 1 name',
//     others: 'order 1 others',
//     orderItems: [
//       {
//         id: 1,
//         name: 'orderItem 1 name',
//         others: 'orderItem 1 others',
//         batches: null,
//       },
//       {
//         id: 2,
//         name: 'orderItem 2 name',
//         others: 'orderItem 2 others',
//         batches: [
//           {
//             id: 1,
//             name: 'batch 1 name',
//             others: 'batch 1 others',
//             container: null,
//             shipment: null,
//           },
//           {
//             id: 2,
//             name: 'batch 2 name',
//             others: 'batch 2 others',
//             container: null,
//             shipment: null,
//           },
//           {
//             id: 3,
//             name: 'batch 3 name',
//             others: 'batch 3 others',
//             container: {
//               id: 1,
//               name: 'container 1 name',
//               others: 'container 1 others',
//             },
//             shipment: {
//               id: 1,
//               name: 'shipment 1 name',
//               others: 'shipment 1 others',
//             },
//           },
//         ],
//       },
//     ],
//   };

//   const result = [
//     [
//       {
//         key: 'order.1.name',
//         value: 'order 1 name',
//       },
//       {
//         key: 'order.1.others',
//         value: 'order 1 others',
//       },
//       { key: 'orderItem.1.name', value: 'orderItem 1 name' },
//       { key: 'orderItem.1.others', value: 'orderItem 1 others' },
//       { key: null, value: null },
//       { key: null, value: null },
//       { key: null, value: null },
//       { key: null, value: null },
//       { key: null, value: null },
//       { key: null, value: null },
//     ],
//     [
//       {
//         key: 'order.1.name',
//         value: 'order 1 name',
//       },
//       {
//         key: 'order.1.others',
//         value: 'order 1 others',
//       },
//       { key: 'orderItem.2.name', value: 'orderItem 2 name' },
//       { key: 'orderItem.2.others', value: 'orderItem 2 others' },
//       { key: 'batch.1.name', value: 'batch 1 name' },
//       { key: 'batch.1.others', value: 'batch 1 others' },
//       { key: null, value: null },
//       { key: null, value: null },
//       { key: null, value: null },
//       { key: null, value: null },
//     ],
//     [
//       {
//         key: 'order.1.name',
//         value: 'order 1 name',
//       },
//       {
//         key: 'order.1.others',
//         value: 'order 1 others',
//       },
//       { key: 'orderItem.2.name', value: 'orderItem 2 name' },
//       { key: 'orderItem.2.others', value: 'orderItem 2 others' },
//       { key: 'batch.2.name', value: 'batch 2 name' },
//       { key: 'batch.2.others', value: 'batch 2 others' },
//       { key: null, value: null },
//       { key: null, value: null },
//       { key: null, value: null },
//       { key: null, value: null },
//     ],
//     [
//       {
//         key: 'order.1.name',
//         value: 'order 1 name',
//       },
//       {
//         key: 'order.1.others',
//         value: 'order 1 others',
//       },
//       { key: 'orderItem.2.name', value: 'orderItem 2 name' },
//       { key: 'orderItem.2.others', value: 'orderItem 2 others' },
//       { key: 'batch.3.name', value: 'batch 3 name' },
//       { key: 'batch.3.others', value: 'batch 3 others' },
//       { key: 'container.1.name', value: 'container 1 name' },
//       { key: 'container.1.others', value: 'container 1 others' },
//       { key: 'shipment.1.name', value: 'shipment 1 name' },
//       { key: 'shipment.1.others', value: 'shipment 1 others' },
//     ],
//   ];
//   const a = transferOrder(order);

//   expect(a).toStrictEqual(result);
// });
