// @flow
import { isValid, addMonths, addWeeks, addDays, formatToDateInput } from 'utils/date';
import type { Task } from 'generated/graphql';

type ProjectInfo = {
  dueDate: ?Date,
  milestones: Array<{
    id: string,
    dueDate: ?Date,
  }>,
};

export const calculateBindingDate = (date: string, dateInterval: Object): ?string => {
  const baseDate = date && isValid(new Date(date)) ? new Date(date) : null;
  if (baseDate) {
    const { months, weeks, days } = dateInterval || {};
    if (months) {
      return formatToDateInput(addMonths(baseDate, months).toString());
    }
    if (weeks) {
      return formatToDateInput(addWeeks(baseDate, weeks).toString());
    }

    return formatToDateInput(addDays(baseDate, days || 0).toString());
  }
  return null;
};

type calculateMilestonesEstimatedCompletionDateType = ({
  milestones: Array<Object>,
}) => Array<string>;
export const calculateMilestonesEstimatedCompletionDate: calculateMilestonesEstimatedCompletionDateType = ({
  milestones = [],
}) => {
  const estimatedCompletionDates = Array(milestones.length).fill(null);

  milestones.forEach((milestone, index) => {
    if (milestone.completedAt) {
      estimatedCompletionDates[index] = milestone.completedAt;
    } else if (index === 0) {
      if (milestone.estimatedCompletionDateBinding) {
        estimatedCompletionDates[index] = null;
      } else {
        estimatedCompletionDates[index] = milestone.estimatedCompletionDate || null;
      }
    } else if (milestone.estimatedCompletionDateBinding) {
      const baseDate = estimatedCompletionDates[index - 1];
      estimatedCompletionDates[index] = calculateBindingDate(
        baseDate,
        milestone.estimatedCompletionDateInterval
      );
    } else {
      estimatedCompletionDates[index] = milestone.estimatedCompletionDate || null;
    }
  });

  return estimatedCompletionDates;
};

export const injectProjectAndMilestoneDueDate = ({
  tasks,
  milestoneId,
  projectInfo,
}: {
  tasks: Array<Task>,
  milestoneId: string,
  projectInfo: ProjectInfo,
}): Array<Task> => {
  const milestone = projectInfo.milestones.find(item => item.id === milestoneId);
  return tasks.map(task => ({
    ...task,
    milestone: {
      ...milestone,
      project: {
        dueDate: projectInfo.dueDate,
      },
    },
  }));
};
