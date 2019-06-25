import { range } from 'lodash';
import faker from 'faker';
import ProjectMilestonesContainer, { initValues } from '../milestones';

const mileStoneGenerator = () => ({
  id: faker.random.uuid(),
  dueDate: faker.date.future(),
  total: faker.random.number({ min: 0, max: 100 }),
  completed: faker.random.number({ min: 0, max: 100 }),
  isCompleted: faker.random.boolean(),
  name: faker.name.findName(),
  entitiesCount: {
    products: 1,
    productProviders: 1,
    orders: 1,
    orderItems: 1,
    batches: 1,
    shipments: 1,
    containers: 1,
  },
  entitiesRelatedCount: {
    products: 1,
    productProviders: 1,
    orders: 1,
    orderItems: 1,
    batches: 1,
    shipments: 1,
    containers: 1,
  },
  tasks: range(10).map(() => ({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    entity: {
      id: faker.random.uuid(),
      __typename: 'Order',
    },
    description: faker.lorem.paragraph(),
    todo: {
      milestone: {
        project: {
          id: faker.random.uuid(),
        },
      },
    },
  })),
});

describe('milestones container', () => {
  it('should init empty array on creation', () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
  });

  it('should return 0 for binding if has no tasks', () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);

    const expected = {
      products: 0,
      productProviders: 0,
      orders: 0,
      orderItems: 0,
      batches: 0,
      shipments: 0,
      containers: 0,
    };

    expect(container.countBindingEntities()).toEqual(expected);
    expect(container.countRelatedEntities()).toEqual(expected);
  });

  it('should calculate related entities base on tasks', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = range(3).map(mileStoneGenerator);
    await container.initDetailValues(milestones);
    expect(container.state).toEqual({ milestones });

    expect(container.countBindingEntities()).toMatchSnapshot();
    expect(container.countBindingEntities()).toEqual({
      products: 3,
      productProviders: 3,
      orders: 3,
      orderItems: 3,
      batches: 3,
      shipments: 3,
      containers: 3,
    });
    expect(container.countRelatedEntities('')).toMatchSnapshot();
    expect(container.countRelatedEntities('')).toEqual({
      products: 0,
      productProviders: 0,
      orders: 30,
      orderItems: 0,
      batches: 0,
      shipments: 0,
      containers: 0,
    });
  });
});
