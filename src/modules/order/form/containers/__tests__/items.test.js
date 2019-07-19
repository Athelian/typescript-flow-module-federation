import faker from 'faker';
import Container, { initValues } from '../items';

describe('order items container', () => {
  it('should init empty array on creation', () => {
    const container = new Container();
    expect(container.state).toEqual(initValues);
  });

  it('should return unique shipments and containers base on batches', async () => {
    const shipment = {
      id: faker.random.uuid(),
      __typename: 'Shipment',
    };
    const items = [
      {
        id: faker.random.uuid(),
        no: faker.name.findName(),
        batches: [
          {
            id: faker.random.uuid(),
            no: faker.name.findName(),
            shipment,
            container: null,
            __typename: 'Batch',
          },
          {
            id: faker.random.uuid(),
            no: faker.name.findName(),
            shipment,
            container: {
              id: faker.random.uuid(),
            },
            __typename: 'Batch',
          },
          {
            id: faker.random.uuid(),
            no: faker.name.findName(),
            shipment: null,
            container: null,
            __typename: 'Batch',
          },
        ],
        __typename: 'OrderItem',
      },
    ];
    const container = new Container();
    await container.initDetailValues(items, true);
    expect(container.state.orderItems).toEqual(items);
    expect(container.getContainers()).toHaveLength(1);
    expect(container.getShipments()).toHaveLength(1);
  });
});
