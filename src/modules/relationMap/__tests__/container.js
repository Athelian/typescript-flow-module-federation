import RelationMapContainer from '../container';

describe('subTree', () => {
  test('is subTree', () => {
    const container = new RelationMapContainer();
    container.overrideState({
      targetedItem: {
        order: {
          order1: true,
        },
      },
    });
  });
});

describe('targetTree', () => {
  test('target Order => untarget Order', async () => {
    const container = new RelationMapContainer();
    const itemRelation = {
      order: {
        order1: true,
      },
      orderItem: {
        item1: true,
        item2: true,
      },
      batch: {
        batch1: true,
        batch2: true,
        batch3: true,
      },
    };
    const relation = { type: 'ORDER' };
    await container.targetTree(itemRelation, relation);
    expect(container.state).toMatchSnapshot();
    await container.resetTargetedItem(itemRelation, relation.type);
    expect(container.state).toMatchSnapshot();
    // console.log(JSON.stringify(container.state, null, 2))
  });

  test('target Order => untarget OrderItem => target Order', async () => {
    const container = new RelationMapContainer();
    const orderRelation = {
      order: {
        order1: true,
      },
      orderItem: {
        item1: true,
        item2: true,
      },
      batch: {
        batch1: true,
        batch2: true,
        batch3: true,
      },
    };
    const targetRelation = { type: 'ORDER' };

    const orderItemRelation = {
      order: {
        order1: true,
      },
      orderItem: {
        item1: true,
      },
      batch: {
        batch1: true,
      },
    };

    const untargetRelation = { type: 'ORDER_ITEM' };

    await container.reset();
    // 1. target order
    await container.targetTree(orderRelation, targetRelation);
    expect(container.state).toMatchSnapshot();
    // 2. untarget orderItem
    await container.resetTargetedItem(orderItemRelation, untargetRelation.type);
    expect(container.state).toMatchSnapshot();
    // 3. target order again
    await container.targetTree(orderRelation, targetRelation);
    expect(container.state).toMatchSnapshot();
  });

  test.only('target Order => untarget OrderItem => target OrderItem', async () => {
    const container = new RelationMapContainer();
    const orderRelation = {
      order: {
        order1: true,
      },
      orderItem: {
        item1: true,
        item2: true,
      },
      batch: {
        batch1: true,
        batch2: true,
        batch3: true,
      },
    };
    const targetRelation = { type: 'ORDER' };

    const orderItemRelation = {
      order: {
        order1: true,
      },
      orderItem: {
        item1: true,
      },
      batch: {
        batch1: true,
      },
    };

    const untargetRelation = { type: 'ORDER_ITEM' };

    await container.reset();
    // 1. target order
    await container.targetTree(orderRelation, targetRelation);
    // expect(container.state).toMatchSnapshot()
    // 2. untarget orderItem
    await container.resetTargetedItem(orderItemRelation, untargetRelation.type);
    // expect(container.state).toMatchSnapshot()
    // 3. target order again
    await container.targetTree(orderItemRelation, untargetRelation.type);
    console.log(JSON.stringify(container.state, null, 2));
    // expect(container.state).toMatchSnapshot()
  });
});
