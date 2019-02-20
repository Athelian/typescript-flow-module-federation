import generateRelation from '../relation';

describe('collapse view', () => {
  it('no orderItem', () => {
    const order = {
      id: '1',
      orderItems: [],
    };
    const result = generateRelation(order, { isCollapsed: true });
    expect(result).toMatchSnapshot();
  });

  it('have orderItem', () => {
    const order = {
      id: '1',
      orderItems: [{ id: '1' }],
    };
    const result = generateRelation(order, { isCollapsed: true });
    expect(result).toMatchSnapshot();
  });
});

describe('normal view', () => {
  it('normal data', () => {
    const order = {
      id: '1',
      orderItems: [
        {
          id: '1',
          batches: [{ id: '1' }, { id: '2' }],
        },
        {
          id: '2',
          batches: [],
        },
      ],
    };
    const result = generateRelation(order, { isCollapsed: false });
    expect(result).toMatchSnapshot();
  });
});
