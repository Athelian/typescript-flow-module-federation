import { calculateTasksCompletion } from './index';

describe('Milestone Card', () => {
  it('deStructureMilestones', () => {
    const tasks = [
      {
        completedAt: '2019-6-30',
      },
      {
        completedAt: '2019-6-30',
      },
      {
        inProgressAt: '2019-6-30',
      },
      {
        skippedAt: '2019-6-30',
      },
      {
        dueDate: '2019-1-30',
      },
      {},
    ];

    expect(calculateTasksCompletion(tasks)).toEqual({
      completed: 2,
      inProgress: 1,
      skipped: 1,
      unCompleted: 2,
      overdueTasks: 1,
    });
  });
});
