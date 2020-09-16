// @flow
import moment from 'moment';
import { formatUTCDatetimeToDatetimeWithTimezone } from 'utils/date';
import type { Task } from 'generated/graphql';

type ProjectInfo = {
  dueDate: ?Date,
  milestones: Array<{
    id: string,
    dueDate: ?Date,
  }>,
};

// baseDate = Datetime with timezone format
// returns Datetime with timezone format with the dateInterval added to it
export const calculateBindingDate = (
  baseDate: string,
  dateInterval: Object,
  timezone: string
): ?string => {
  if (baseDate) {
    const { months, weeks, days } = dateInterval || {};
    const dateObj = moment.utc(baseDate);

    if (months) {
      dateObj.add(months, 'months');
    } else if (weeks) {
      dateObj.add(weeks, 'weeks');
    } else if (days) {
      dateObj.add(days, 'days');
    }

    return formatUTCDatetimeToDatetimeWithTimezone(
      dateObj.format('YYYY-MM-DDTHH:mm:ss').concat('Z'),
      timezone
    );
  }
  return null;
};

type calculateMilestonesEstimatedCompletionDateType = (
  {
    milestones: Array<Object>,
  },
  timezone: string
) => Array<string>;

export const calculateMilestonesEstimatedCompletionDate: calculateMilestonesEstimatedCompletionDateType = (
  { milestones = [] },
  timezone
) => {
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
        milestone.estimatedCompletionDateInterval,
        timezone
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
