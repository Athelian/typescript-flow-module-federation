// @flow
// UI utils

export const calculatePercentage = (total: number, completed: number) => {
  if (total) {
    if (completed >= total) return 100;
    return Math.round((completed * 100) / total);
  }

  return 0;
};
