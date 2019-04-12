// @flow

export const hasAutoDate = (tasks: Array<Object>): boolean => {
  const hasAtLeastOneAutoDate = tasks.some(task => task.startDateInterval || task.dueDateInterval);

  return hasAtLeastOneAutoDate;
};

export default hasAutoDate;
