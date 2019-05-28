import faker from 'faker';
import { wait } from 'react-testing-library';
import Task, { initValues } from '../tasks';

describe('task end product container', () => {
  it('should init empty array on creation', () => {
    const container = new Task();
    expect(container.state).toEqual(initValues);
  });

  it('should reset status and remove staff when change exporter ', () => {
    const container = new Task();
    const group = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
    };

    const staff = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    const remainUsers = [
      {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        group: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
        },
      },
      {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        group: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
        },
      },
    ];

    const task = {
      id: faker.random.uuid(),
      approvable: true,
      name: faker.name.findName(),
      rejectedAt: null,
      rejectedBy: null,
      approvedAt: null,
      approvedBy: null,
      assignedTo: [
        {
          ...staff,
          group,
        },
        ...remainUsers,
      ],
      approvers: [
        {
          ...staff,
          group,
        },
        ...remainUsers,
      ],
      tags: [],
      memo: null,
      taskTemplate: null,
    };

    const initTodo = {
      tasks: [
        {
          ...task,
          inProgressAt: faker.date.future(),
          inProgressBy: {
            ...staff,
            group,
          },
          completedAt: faker.date.future(),
          completedBy: {
            ...staff,
            group,
          },
        },
      ],
      taskTemplate: null,
    };
    container.initDetailValues(initTodo);

    expect(container.originalValues.todo).toEqual(initTodo);
    wait(() => {
      expect(container.state.todo).toEqual(initTodo);
    });

    container.onChangeExporter(group);

    wait(() => {
      expect(container.state.todo.tasks).toEqual([
        {
          ...task,
          inProgressAt: null,
          inProgressBy: null,
          completedAt: null,
          completedBy: null,
          assignedTo: remainUsers,
          approvers: remainUsers,
        },
      ]);
    });
  });
});
