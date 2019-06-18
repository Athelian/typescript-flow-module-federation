import { deStructureMilestones } from './index';

describe('Project Card', () => {
  it('deStructureMilestones', () => {
    const milestones = [
      {
        tasks: [
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
        ],
      },
      {},
    ];

    expect(deStructureMilestones(milestones)).toEqual({
      completed: 2,
      inProgress: 1,
      skipped: 1,
      unCompleted: 2,
      overdueTasks: 1,
    });
  });
});
