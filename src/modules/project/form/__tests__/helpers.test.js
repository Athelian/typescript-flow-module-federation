import { range } from 'lodash';
import faker from 'faker';
import sortBy, { ENTITIES } from '../helpers';

describe('Milestone - manual sort', () => {
  it('should sort by default with milestoneSort desc', () => {
    const tasks = range(faker.random.number({ min: 5, max: 10 })).map((_, milestoneSort) => ({
      milestoneSort,
      id: faker.random.uuid(),
      name: faker.name.findName(),
      startDate: faker.date.future(),
      dueDate: faker.date.future(),
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
      entity: {
        __typename: ENTITIES[faker.random.number({ min: 0, max: ENTITIES.length - 1 })],
      },
    }));
    expect(sortBy(tasks, { field: 'default', direction: 'desc' })).toEqual(tasks.reverse());
  });

  it('should sort by default with milestoneSort asc', () => {
    const tasks = range(faker.random.number({ min: 5, max: 10 })).map((_, milestoneSort) => ({
      milestoneSort,
      id: faker.random.uuid(),
      name: faker.name.findName(),
      startDate: faker.date.future(),
      dueDate: faker.date.future(),
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
      entity: {
        __typename: ENTITIES[faker.random.number({ min: 0, max: ENTITIES.length - 1 })],
      },
    }));
    expect(sortBy(tasks, { field: 'default', direction: 'asc' })).toEqual(tasks);
  });

  it('should sort by name desc', () => {
    const baseTask = {
      milestoneSort: 0,
      id: faker.random.uuid(),
      startDate: faker.date.future(),
      dueDate: faker.date.future(),
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
      entity: {
        __typename: ENTITIES[faker.random.number({ min: 0, max: ENTITIES.length - 1 })],
      },
    };
    const tasks = [
      {
        ...baseTask,
        name: 'a',
      },
      {
        ...baseTask,
        name: 'c',
      },
      {
        ...baseTask,
        name: 'b',
      },
    ];
    expect(sortBy(tasks, { field: 'name', direction: 'desc' })).toEqual([
      {
        ...baseTask,
        name: 'c',
      },
      {
        ...baseTask,
        name: 'b',
      },
      {
        ...baseTask,
        name: 'a',
      },
    ]);
  });
  it('should sort by name asc', () => {
    const baseTask = {
      milestoneSort: 0,
      id: faker.random.uuid(),
      startDate: faker.date.future(),
      dueDate: faker.date.future(),
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
      entity: {
        __typename: ENTITIES[faker.random.number({ min: 0, max: ENTITIES.length - 1 })],
      },
    };
    const tasks = [
      {
        ...baseTask,
        name: 'a',
      },
      {
        ...baseTask,
        name: 'c',
      },
      {
        ...baseTask,
        name: 'b',
      },
    ];
    expect(sortBy(tasks, { field: 'name', direction: 'asc' })).toEqual([
      {
        ...baseTask,
        name: 'a',
      },
      {
        ...baseTask,
        name: 'b',
      },
      {
        ...baseTask,
        name: 'c',
      },
    ]);
  });

  it('should sort by startDate desc', () => {
    const baseTask = {
      milestoneSort: 0,
      id: faker.random.uuid(),
      name: faker.name.findName(),
      dueDate: faker.date.future(),
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
      entity: {
        __typename: ENTITIES[faker.random.number({ min: 0, max: ENTITIES.length - 1 })],
      },
    };
    const date = faker.date.future();
    const now = new Date();
    const tasks = [
      {
        ...baseTask,
        startDate: '',
      },
      {
        ...baseTask,
        startDate: date,
      },
      {
        ...baseTask,
        startDate: now,
      },
    ];
    expect(sortBy(tasks, { field: 'startDate', direction: 'desc' })).toEqual([
      {
        ...baseTask,
        startDate: date,
      },
      {
        ...baseTask,
        startDate: now,
      },
      {
        ...baseTask,
        startDate: '',
      },
    ]);
  });

  it('should sort by startDate asc', () => {
    const baseTask = {
      milestoneSort: 0,
      id: faker.random.uuid(),
      name: faker.name.findName(),
      dueDate: faker.date.future(),
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
      entity: {
        __typename: ENTITIES[faker.random.number({ min: 0, max: ENTITIES.length - 1 })],
      },
    };
    const date = faker.date.future();
    const now = new Date();
    const tasks = [
      {
        ...baseTask,
        startDate: '',
      },
      {
        ...baseTask,
        startDate: date,
      },
      {
        ...baseTask,
        startDate: null,
      },
      {
        ...baseTask,
        startDate: now,
      },
    ];
    expect(sortBy(tasks, { field: 'startDate', direction: 'asc' })).toEqual([
      {
        ...baseTask,
        startDate: '',
      },
      {
        ...baseTask,
        startDate: null,
      },
      {
        ...baseTask,
        startDate: now,
      },
      {
        ...baseTask,
        startDate: date,
      },
    ]);
  });

  it('should sort by entity desc', () => {
    const baseTask = {
      milestoneSort: 0,
      id: faker.random.uuid(),
      name: faker.name.findName(),
      startDate: faker.date.future(),
      dueDate: faker.date.future(),
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
    };
    const tasks = [
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[1],
        },
      },
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[5],
        },
      },
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[2],
        },
      },
    ];
    expect(sortBy(tasks, { field: 'entity', direction: 'desc' })).toEqual([
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[1],
        },
      },
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[2],
        },
      },
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[5],
        },
      },
    ]);
  });

  it('should sort by entity asc', () => {
    const baseTask = {
      milestoneSort: 0,
      id: faker.random.uuid(),
      name: faker.name.findName(),
      startDate: faker.date.future(),
      dueDate: faker.date.future(),
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
    };
    const tasks = [
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[1],
        },
      },
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[5],
        },
      },
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[2],
        },
      },
    ];
    expect(sortBy(tasks, { field: 'entity', direction: 'asc' })).toEqual([
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[5],
        },
      },
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[2],
        },
      },
      {
        ...baseTask,
        entity: {
          __typename: ENTITIES[1],
        },
      },
    ]);
  });
});
