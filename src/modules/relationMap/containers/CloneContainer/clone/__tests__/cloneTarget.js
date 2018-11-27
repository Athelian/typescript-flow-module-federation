import { cloneBatchByUpdateOrder } from '../cloneTarget';

describe('cloneBatch', () => {
  test('cloneBatchByUpdateOrder', async () => {
    const client = {
      mutate: jest.fn(),
    };
    const target = [
      {
        id: '1',
        no: 'batch1',
        quantity: 30,
        orderItemId: '1',
        orderItem: {
          id: '1',
          order: {
            id: '1',
            orderItems: [
              {
                id: '1',
                batches: [{ id: '1' }, { id: '2' }],
              },
            ],
          },
        },
      },
      {
        id: '2',
        no: 'batch2',
        quantity: 303,
        orderItemId: '1',
        orderItem: {
          id: '1',
          order: {
            id: '1',
            orderItems: [
              {
                id: '1',
                batches: [{ id: '1' }, { id: '2' }],
              },
              {
                id: '2',
                batches: [{ id: '3' }],
              },
            ],
          },
        },
      },
      {
        id: '3',
        no: 'batch3,',
        quantity: 3243,
        orderItemId: '2',
        orderItem: {
          id: '2',
          order: {
            id: '1',
            orderItems: [
              {
                id: '1',
                batches: [{ id: '1' }, { id: '2' }],
              },
              {
                id: '2',
                batches: [{ id: '3' }],
              },
            ],
          },
        },
      },
    ];
    await cloneBatchByUpdateOrder(client, target, {});
  });
});
