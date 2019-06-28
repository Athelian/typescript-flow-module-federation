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

  it('should add new milestone', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    await container.newMilestone();
    expect(container.state.milestones.length).toEqual(1);
  });

  it('should change ordering of milestones', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = [
      {
        id: 1,
        tasks: [],
      },
      {
        id: 2,
        tasks: [],
      },
      {
        id: 3,
        tasks: [],
      },
    ];
    await container.initDetailValues(milestones);
    expect(container.state).toEqual({ milestones });
    await container.changeMilestoneOrdering([2, 3, 1]);
    expect(container.state).toEqual({
      milestones: [
        {
          id: 2,
          tasks: [],
        },
        {
          id: 3,
          tasks: [],
        },
        {
          id: 1,
          tasks: [],
        },
      ],
    });
  });

  it('should change ordering of tasks under milestone', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = [
      {
        id: '1',
        tasks: [
          {
            id: 4,
          },
        ],
      },
      {
        id: '2',
        tasks: [],
      },
      {
        id: '3',
        tasks: [],
      },
    ];
    await container.initDetailValues(milestones);
    expect(container.state).toEqual({ milestones });
    await container.changeMilestones({
      1: [],
      2: [],
      3: [
        {
          id: 4,
        },
      ],
    });
    expect(container.state).toEqual({
      milestones: [
        {
          id: '1',
          tasks: [],
        },
        {
          id: '2',
          tasks: [],
        },
        {
          id: '3',
          tasks: [
            {
              id: 4,
            },
          ],
        },
      ],
    });
  });

  it('should return milestone status', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = [
      {
        id: '1',
        name: 'a',
        dueDate: null,
        tasks: [
          {
            id: 4,
          },
        ],
      },
      {
        id: '2',
        name: 'b',
        dueDate: null,
        tasks: [],
      },
      {
        id: '3',
        name: 'c',
        dueDate: null,
        tasks: [],
      },
    ];
    await container.initDetailValues(milestones);
    const result = await container.milestoneStatus();

    expect(result).toMatchSnapshot();
    expect(result).toEqual([
      {
        completed: 0,
        dueDate: null,
        isCompleted: false,
        name: 'a',
        total: 1,
      },
      {
        completed: 0,
        dueDate: null,
        isCompleted: false,
        name: 'b',
        total: 0,
      },
      {
        completed: 0,
        dueDate: null,
        isCompleted: false,
        name: 'c',
        total: 0,
      },
    ]);
  });

  it('should change the milestone name', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = [
      {
        id: '1',
        name: 'a',
        dueDate: null,
        tasks: [
          {
            id: 4,
          },
        ],
      },
      {
        id: '2',
        name: 'b',
        dueDate: null,
        tasks: [],
      },
      {
        id: '3',
        name: 'c',
        dueDate: null,
        tasks: [],
      },
    ];
    await container.initDetailValues(milestones);
    const updateValue = {
      dueDate: '2019-06-26T10:57:34.256Z',
    };
    await container.setMilestoneValue('1', updateValue);
    expect(container.state.milestones).toMatchSnapshot();
    expect(container.state.milestones[0]).toEqual({
      id: '1',
      name: 'a',
      tasks: [
        {
          id: 4,
        },
      ],
      ...updateValue,
    });

    await container.setMilestoneValue('1', {
      name: 'abc',
    });

    expect(container.state.milestones[0]).toEqual({
      id: '1',
      name: 'abc',
      tasks: [
        {
          id: 4,
        },
      ],
      ...updateValue,
    });
  });

  it('should return ignore task ids', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = [
      {
        id: '1',
        name: 'a',
        dueDate: null,
        tasks: [
          {
            id: 4,
          },
        ],
      },
      {
        id: '2',
        name: 'b',
        dueDate: null,
        tasks: [
          {
            id: 5,
          },
        ],
      },
      {
        id: '3',
        name: 'c',
        dueDate: null,
        tasks: [],
      },
    ];
    await container.initDetailValues(milestones);
    const ignoreIds = container.excludeTaskIds();

    expect(ignoreIds).toEqual([4, 5]);
  });

  it('should delete milestone by id', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = [
      {
        id: '1',
        name: 'a',
        dueDate: null,
        tasks: [
          {
            id: 4,
          },
        ],
      },
      {
        id: '2',
        name: 'b',
        dueDate: null,
        tasks: [
          {
            id: 5,
          },
        ],
      },
      {
        id: '3',
        name: 'c',
        dueDate: null,
        tasks: [],
      },
    ];
    await container.initDetailValues(milestones);
    await container.removeMilestone('2');

    expect(container.state).toMatchSnapshot();
    expect(container.state).toEqual({
      milestones: [
        {
          id: '1',
          name: 'a',
          dueDate: null,
          tasks: [
            {
              id: 4,
            },
          ],
        },
        {
          id: '3',
          name: 'c',
          dueDate: null,
          tasks: [],
        },
      ],
    });
  });
});
