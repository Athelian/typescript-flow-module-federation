import { formatNodes } from '../formatter';

describe('_formatNodes', () => {
  it('format order', () => {
    const data = [
      { id: 1, orderItems: [] },
      { id: 2, orderItems: [] },
      { id: 3, orderItems: [] },
      { id: 4, orderItems: [] },
    ];
    const result = { order: [{ id: 2 }, { id: 4 }] };
    const expected = formatNodes(data, result);
    expect(expected).toMatchSnapshot();
  });

  it('format newOrderItem', () => {
    const data = [
      {
        id: 1,
        orderItems: [
          { id: 1, batches: [] },
          { id: 2, batches: [] },
          { id: 3, batches: [] },
          { id: 4, batches: [] },
        ],
      },
    ];
    const result = {
      orderItem: {
        '1': [{ id: 4 }],
      },
    };
    const expected = formatNodes(data, result);
    expect(expected).toMatchSnapshot();
  });

  it('format batches', () => {
    const data = [
      {
        id: 1,
        orderItems: [
          {
            id: 1,
            batches: [{ id: 1 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }],
          },
        ],
      },
    ];
    const result = {
      batch: {
        1: [{ id: 12 }, { id: 14 }],
      },
    };
    const expected = formatNodes(data, result);
    expect(expected).toMatchSnapshot();
  });

  it('format mess data', () => {
    const data = [
      {
        id: 1,
        orderItems: [
          {
            id: 1,
            batches: [{ id: 1 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }],
          },
        ],
      },
      {
        id: 2,
        orderItems: [{ id: 2, batches: null }, { id: 3, batches: null }, { id: 4, batches: null }],
      },
    ];
    const result = {
      orderItem: {
        2: [{ id: 4 }],
      },
      batch: {
        1: [{ id: 12 }, { id: 14 }],
      },
    };
    const expected = formatNodes(data, result);
    expect(expected).toMatchSnapshot();
  });
});
