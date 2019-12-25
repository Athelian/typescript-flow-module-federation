// @flow

export const computeMilestoneStatus = (milestone: Object) =>
  !!milestone.completedAt && !!milestone.completedBy ? 'completed' : 'uncompleted';

export const computeTaskStatus = (task: Object) => {
  if (!!task.skippedAt && !!task.skippedBy) {
    return 'skipped';
  }
  if (!!task.completedAt && !!task.completedBy) {
    return 'completed';
  }
  if (!!task.inProgressAt && !!task.inProgressBy) {
    return 'in_progress';
  }
  return 'uncompleted';
};

export const computeTaskApprovalStatus = (task: Object) => {
  if (task.approvable) {
    if (!!task.rejectedAt && !!task.rejectedBy) {
      return 'rejected';
    }
    if (!!task.approvedAt && !!task.approvedBy) {
      return 'approved';
    }
  }
  return 'unapproved';
};
