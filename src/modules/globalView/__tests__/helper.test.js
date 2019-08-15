import {
  transferOfOrder,
  transferOfOrderItem,
  transferOfBatch,
  transferOfContainer,
  transferOfShipment,
} from '../helper';

it('order transfer should return 2 items', () => {
  const order = {
    id: 1,
    name: 'order 1 name',
    others: 'order 1 others',
    orderItems: [{ id: 1, name: 'item 1 name' }],
  };
  const result = [
    {
      key: 'order.1.name',
      value: 'order 1 name',
    },
    {
      key: 'order.1.others',
      value: 'order 1 others',
    },
  ];
  expect(transferOfOrder(order)).toStrictEqual(result);
});

it('orderItem transfer should return 2 items', () => {
  const orderItem = {
    id: 1,
    name: 'orderItem 1 name',
    others: 'orderItem 1 others',
    batches: [{ id: 1, name: 'batch 1 name' }],
  };
  const result = [
    {
      key: 'orderItem.1.name',
      value: 'orderItem 1 name',
    },
    {
      key: 'orderItem.1.others',
      value: 'orderItem 1 others',
    },
  ];
  expect(transferOfOrderItem(orderItem)).toStrictEqual(result);
});

it('batch transfer should return 2 items', () => {
  const batch = {
    id: 1,
    name: 'batch 1 name',
    others: 'batch 1 others',
    container: {},
    shipment: {},
  };
  const result = [
    { key: 'batch.1.name', value: 'batch 1 name' },
    { key: 'batch.1.others', value: 'batch 1 others' },
  ];

  expect(transferOfBatch(batch)).toStrictEqual(result);
});

it('container transfer should return 2 items', () => {
  const container = {
    id: 1,
    name: 'container 1 name',
    others: 'container 1 others',
  };
  const result = [
    { key: 'container.1.name', value: 'container 1 name' },
    { key: 'container.1.others', value: 'container 1 others' },
  ];

  expect(transferOfContainer(container)).toStrictEqual(result);
});

it('shipment transfer should return 2 items', () => {
  const shipment = {
    id: 1,
    name: 'shipment 1 name',
    others: 'shipment 1 others',
  };
  const result = [
    { key: 'shipment.1.name', value: 'shipment 1 name' },
    { key: 'shipment.1.others', value: 'shipment 1 others' },
  ];

  expect(transferOfShipment(shipment)).toStrictEqual(result);
});
