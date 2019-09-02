// @flow
import { isNullOrUndefined } from 'utils/fp';
import { isValid, addMonths, addWeeks, addDays, formatToDateInput } from 'utils/date';

export const calculateBindingDate = (date: string, dateInterval: Object): ?string => {
  const baseDate = date && isValid(new Date(date)) ? new Date(date) : null;
  if (baseDate) {
    const { months, weeks, days } = dateInterval || {};
    if (!isNullOrUndefined(months)) {
      return formatToDateInput(addMonths(baseDate, months).toString());
    }
    if (!isNullOrUndefined(weeks)) {
      return formatToDateInput(addWeeks(baseDate, weeks).toString());
    }
    if (!isNullOrUndefined(days)) {
      return formatToDateInput(addDays(baseDate, days).toString());
    }
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
    if (index === 0) {
      if (milestone.completedAt) {
        estimatedCompletionDates[index] = milestone.completedAt;
      } else if (isNullOrUndefined(milestone.estimatedCompletionDateBinding)) {
        estimatedCompletionDates[index] = milestone.estimatedCompletionDate;
      } else {
        estimatedCompletionDates[index] = null;
      }
    } else if (isNullOrUndefined(milestone.estimatedCompletionDateBinding)) {
      if (milestone.completedAt) {
        estimatedCompletionDates[index] = milestone.completedAt;
      } else {
        estimatedCompletionDates[index] = milestone.estimatedCompletionDate;
      }
    } else {
      const baseDate = estimatedCompletionDates[index - 1];
      estimatedCompletionDates[index] = calculateBindingDate(
        baseDate,
        milestone.estimatedCompletionDateInterval
      );
    }
  });

  return estimatedCompletionDates;
};

export default 1;
