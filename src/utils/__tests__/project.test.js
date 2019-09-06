import {
  calculateBindingDate,
  calculateMilestonesEstimatedCompletionDate,
  injectProjectAndMilestoneDueDate,
} from '../project';

describe('utils/project calculateBindingDate', () => {
  test('null', () => {
    expect(calculateBindingDate(null, null)).toBe(null);
    expect(calculateBindingDate('2019-09-06', { months: 1 })).toBe('2019-10-06');
    expect(calculateBindingDate('2019-09-06', { weeks: 1 })).toBe('2019-09-13');
    expect(calculateBindingDate('2019-09-06', { days: 1 })).toBe('2019-09-07');
  });
});

describe('utils/project calculateMilestonesEstimatedCompletionDate', () => {
  test('[]', () => {
    const result = calculateMilestonesEstimatedCompletionDate({});
    expect(result).toEqual([]);
  });
  test('3 null', () => {
    const milestones = [
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
    ];
    const result = calculateMilestonesEstimatedCompletionDate({ milestones });
    expect(result).toEqual([null, null, null]);
  });

  test('3 null', () => {
    const milestones = [
      {},
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
    ];
    const result = calculateMilestonesEstimatedCompletionDate({ milestones });
    expect(result).toEqual([null, null, null]);
  });

  test(`null, '2019-09-60', '2019-09-06'`, () => {
    const milestones = [
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
      {
        estimatedCompletionDate: '2019-09-06',
      },
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
    ];
    const result = calculateMilestonesEstimatedCompletionDate({ milestones });
    expect(result).toEqual([null, '2019-09-06', '2019-09-06']);
  });

  test(`null, '2019-09-60', '2019-09-06'`, () => {
    const milestones = [
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
      {
        completedAt: '2019-09-06',
      },
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
    ];
    const result = calculateMilestonesEstimatedCompletionDate({ milestones });
    expect(result).toEqual([null, '2019-09-06', '2019-09-06']);
  });

  test(`null, null, null`, () => {
    const milestones = [
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
      {
        completedAt: '',
      },
      {
        estimatedCompletionDateBinding: 'MilestoneDueDate',
      },
    ];
    const result = calculateMilestonesEstimatedCompletionDate({ milestones });
    expect(result).toEqual([null, null, null]);
  });
});

describe('utils/project injectProjectAndMilestoneDueDate', () => {
  test('find a milestone', () => {
    const result = injectProjectAndMilestoneDueDate({
      tasks: [{ name: 'task name' }],
      milestoneId: '1',
      projectInfo: { milestones: [{ id: '1' }], dueDate: null },
    });

    expect(result).toEqual([
      {
        name: 'task name',
        milestone: {
          id: '1',
          project: {
            dueDate: null,
          },
        },
      },
    ]);
  });
});
