// @flow
import { differenceInCalendarDays } from 'utils/date';

export const calculatePercentage = (total: number, completed: number) => {
  if (total) {
    if (completed >= total) return 100;
    return Math.round((completed * 100) / total);
  }

  return 0;
};

export const diffDueDate = ({ dueDate, date }: { dueDate: ?string, date: ?string }) => {
  if (dueDate && date) {
    const diffDate = differenceInCalendarDays(new Date(date), new Date(dueDate));
    if (diffDate > 0) {
      return { value: `+${diffDate}`, color: 'RED' };
    }
    if (diffDate < 0) {
      return { value: diffDate, color: 'TEAL' };
    }
    return { value: 0, color: 'GRAY' };
  }
  return { value: 'N/A', color: 'GRAY' };
};
