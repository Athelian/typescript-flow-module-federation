// @flow
import { isNullOrUndefined } from 'utils/fp';
import { isValid, addMonths, addWeeks, addDays, formatToDateInput } from 'utils/date';

export const calculateBindingDate = (date: string, dateInterval: Object): string => {
  const baseDate = isValid(new Date(date)) ? new Date(date) : null;
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
      let baseDate = estimatedCompletionDates[index - 1];
      baseDate = isValid(new Date(baseDate)) ? new Date(baseDate) : null;
      if (baseDate) {
        const { months, weeks, days } = milestone.estimatedCompletionDateInterval || {};
        if (!isNullOrUndefined(months)) {
          estimatedCompletionDates[index] = addMonths(baseDate, months).toString();
        } else if (!isNullOrUndefined(weeks)) {
          estimatedCompletionDates[index] = addWeeks(baseDate, weeks).toString();
        } else if (!isNullOrUndefined(days)) {
          estimatedCompletionDates[index] = addDays(baseDate, days).toString();
        }
      } else {
        estimatedCompletionDates[index] = null;
      }
    }
  });

  return estimatedCompletionDates;
};

export default 1;
