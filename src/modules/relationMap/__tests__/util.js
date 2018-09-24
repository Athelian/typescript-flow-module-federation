import * as util from '../util';

describe('ShipmentFocused', () => {
  test('normal case', () => {
    const data = {
      id: '29',
      batches: [
        {
          orderItem: {
            id: '660',
            order: {
              id: '97',
            },
          },
        },
        {
          orderItem: {
            id: '660',
            order: {
              id: '97',
            },
          },
        },
      ],
    };
    const config = util.generateShipmentRelation(data);
    expect(config).toMatchSnapshot();
  });
  test('no batch', () => {
    const data = {
      id: '29',
      batches: [],
    };
    const config = util.generateShipmentRelation(data);
    expect(config).toMatchSnapshot();
  });
});
