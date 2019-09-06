import faker from 'faker';
import ProjectMilestonesContainer, { initValues } from '../milestones';

describe('milestones container', () => {
  it('should init empty array on creation', () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
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
    expect(container.state.milestones).toEqual(milestones);
    await container.changeMilestoneOrdering([2, 3, 1]);
    expect(container.state.milestones).toEqual([
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
    ]);
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
    expect(container.state.milestones).toEqual(milestones);
    await container.changeMilestones({
      1: [],
      2: [],
      3: [
        {
          id: 4,
        },
      ],
    });
    expect(container.state.milestones).toEqual([
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
            milestoneSort: 0,
            milestone: {
              id: '3',
              tasks: [],
            },
          },
        ],
      },
    ]);
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

    expect(container.excludeTaskIds()).toEqual([]);
    await container.removeMilestone('1');
    expect(container.excludeTaskIds()).toEqual([4]);
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
    expect(container.state.milestones).toEqual([
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
    ]);

    await container.removeMilestone('1', true);
    expect(container.state.ignoreTaskIds).toEqual([4]);
  });

  it('should count task by milestone id', async () => {
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
            completedAt: new Date(),
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

    expect(container.taskCountByMilestone('1')).toMatchSnapshot();
    expect(container.taskCountByMilestone('1')).toEqual({
      approved: 0,
      completed: 1,
      count: 1,
      delayed: 0,
      inProgress: 0,
      rejected: 0,
      remain: 0,
      skipped: 0,
      unapproved: 0,
    });
    expect(container.taskCountByMilestone('3')).toMatchSnapshot();
    expect(container.taskCountByMilestone('3')).toEqual({
      approved: 0,
      completed: 0,
      count: 0,
      delayed: 0,
      inProgress: 0,
      rejected: 0,
      remain: 0,
      skipped: 0,
      unapproved: 0,
    });
  });

  it('should change task status base on milestone', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const date = new Date();
    const milestones = [
      {
        id: '1',
        name: 'a',
        dueDate: null,
        tasks: [
          {
            id: 4,
            inProgressAt: date,
          },
        ],
      },
    ];
    await container.initDetailValues(milestones);
    const completedBy = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
    };
    const completedAt = faker.date.future();
    await container.completedMilestone({
      id: '1',
      completedBy,
      completedAt,
      action: 'leaveUnChange',
    });
    expect(container.state.milestones).toEqual([
      {
        id: '1',
        name: 'a',
        dueDate: null,
        completedBy,
        completedAt,
        tasks: [
          {
            id: 4,
            inProgressAt: date,
          },
        ],
      },
    ]);
  });

  it('should update task for milestone with id', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const dueDate = faker.date.future();
    const name = faker.name.findName();
    const milestones = [
      {
        id: '1',
        name: 'a',
        dueDate: null,
        tasks: [
          {
            id: 4,
            name: 'a',
            dueDate: null,
          },
        ],
      },
    ];
    await container.initDetailValues(milestones);

    await container.updateTask({
      milestoneId: '1',
      taskId: 4,
      task: {
        name,
      },
    });

    expect(container.state.milestones).toEqual([
      {
        id: '1',
        name: 'a',
        dueDate: null,
        tasks: [
          {
            id: 4,
            name,
            dueDate: null,
          },
        ],
      },
    ]);

    await container.updateTask({
      milestoneId: '1',
      taskId: 4,
      task: {
        dueDate,
      },
    });

    expect(container.state.milestones).toEqual([
      {
        id: '1',
        name: 'a',
        dueDate: null,
        tasks: [
          {
            id: 4,
            name,
            dueDate,
          },
        ],
      },
    ]);
  });

  it('should remove task on milestone', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = [
      {
        id: '1',
        tasks: [
          {
            id: 4,
            name: 'a',
            dueDate: null,
          },
        ],
      },
    ];
    await container.initDetailValues(milestones);

    await container.removeTask({
      milestoneId: '1',
      taskId: 4,
      isDelete: true,
    });

    expect(container.state.milestones).toEqual([
      {
        id: '1',
        tasks: [],
      },
    ]);
    expect(container.deleteTasks).toEqual([4]);
  });

  it('should update tasks of all milestones', async () => {
    const container = new ProjectMilestonesContainer();
    expect(container.state).toEqual(initValues);
    const milestones = [
      {
        id: '1',
        tasks: [
          {
            id: 4,
            name: 'a',
            dueDate: null,
          },
        ],
      },
      {
        id: '2',
        tasks: [
          {
            id: 3,
            name: 'b',
          },
        ],
      },
    ];
    await container.initDetailValues(milestones);

    await container.updateTasks([
      {
        id: 3,
        name: 'bc',
      },
      {
        id: 4,
        name: '1a',
        dueDate: null,
      },
    ]);

    expect(container.state.milestones).toEqual([
      {
        id: '1',
        tasks: [
          {
            id: 4,
            name: '1a',
            dueDate: null,
          },
        ],
      },
      {
        id: '2',
        tasks: [
          {
            id: 3,
            name: 'bc',
          },
        ],
      },
    ]);
  });
});
