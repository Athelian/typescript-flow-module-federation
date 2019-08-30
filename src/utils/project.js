// @flow
import { isNullOrUndefined } from 'utils/fp';
import { addMonths, addWeeks, addDays } from 'utils/date';

type calculateMilestonesEstimatedCompletionDateType = ({
  milestones: Array<Object>,
}) => Array<Date>;

export const calculateMilestonesEstimatedCompletionDate: calculateMilestonesEstimatedCompletionDateType = ({
  milestones = [],
}) => {
  const estimatedCompletionDates = Array(milestones.length).fill(null);

  milestones.forEach((milestone, index) => {
    if (index === 0) {
      if (isNullOrUndefined(milestone.estimatedCompletionDateBinding)) {
        estimatedCompletionDates[index] = milestone.estimatedCompletionDate
          ? new Date(milestone.estimatedCompletionDate)
          : null;
      } else {
        estimatedCompletionDates[index] = null;
      }
    } else if (isNullOrUndefined(milestone.estimatedCompletionDateBinding)) {
      estimatedCompletionDates[index] = milestone.estimatedCompletionDate
        ? new Date(milestone.estimatedCompletionDate)
        : null;
    } else {
      const baseDate = estimatedCompletionDates[index - 1];
      const { months, weeks, days } = milestone.estimatedCompletionDateInterval || {};
      if (!isNullOrUndefined(months)) {
        estimatedCompletionDates[index] = addMonths(baseDate, months);
      } else if (!isNullOrUndefined(weeks)) {
        estimatedCompletionDates[index] = addWeeks(baseDate, weeks);
      } else if (!isNullOrUndefined(days)) {
        estimatedCompletionDates[index] = addDays(baseDate, days);
      }
    }
  });

  return estimatedCompletionDates;
};

export default 1;
