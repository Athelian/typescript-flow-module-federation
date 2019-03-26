// @flow

export const getLatestDate = (timelineDate: ?Object) => {
  if (!timelineDate) return null;

  const { date, timelineDateRevisions } = timelineDate;

  const hasDateRevisions = timelineDateRevisions && timelineDateRevisions.length > 0;
  const latestDate = hasDateRevisions
    ? timelineDateRevisions[timelineDateRevisions.length - 1].date
    : date;

  return latestDate;
};

export default getLatestDate;
