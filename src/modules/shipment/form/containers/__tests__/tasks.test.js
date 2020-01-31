import faker from 'faker';
import Task, { initValues } from '../tasks';

describe('shipment task container', () => {
  it('should init empty array on creation', () => {
    const container = new Task();
    expect(container.state).toEqual(initValues);
  });

  it('should reset status and remove staff when change exporter ', async () => {
    const container = new Task();
    const organization = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
    };

    const staff = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      organization,
    };

    const remainUsers = [
      {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        organization: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
        },
      },
      {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        organization: {
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
      approvers: [
        {
          ...staff,
          organization,
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
            organization,
          },
          completedAt: faker.date.future(),
          completedBy: {
            ...staff,
            organization,
          },
        },
      ],
    };

    await container.initDetailValues(initTodo, true);

    expect(container.originalValues.todo).toEqual(initTodo);
    expect(container.state.todo).toEqual(initTodo);

    await container.onChangePartner(organization);

    expect(container.state.todo.tasks).toEqual([
      {
        ...task,
        inProgressAt: null,
        inProgressBy: null,
        completedAt: null,
        completedBy: null,
        approvers: remainUsers,
      },
    ]);
  });
});
