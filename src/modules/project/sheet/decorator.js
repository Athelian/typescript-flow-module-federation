// @flow
import { computeTaskApprovalStatus, computeMilestoneStatus, computeTaskStatus } from './helper';

export function decorateTask(task: Object): Object {
  return {
    ...task,
    status: computeTaskStatus(task),
    statusDate: {
      in_progress: {
        at: task.inProgressAt,
        by: task.inProgressBy,
      },
      completed: {
        at: task.completedAt,
        by: task.completedBy,
      },
      skipped: {
        at: task.skippedAt,
        by: task.skippedBy,
      },
    },
    approvalStatus: computeTaskApprovalStatus(task),
    approvalStatusDate: {
      approved: {
        at: task.approvedAt,
        by: task.approvedBy,
      },
      rejected: {
        at: task.rejectedAt,
        by: task.rejectedBy,
      },
    },
    startDateBindingData: {
      date: task.startDate,
      interval: task.startDateInterval,
      binding: task.startDateBinding,
    },
    dueDateBindingData: {
      date: task.dueDate,
      interval: task.dueDateInterval,
      binding: task.dueDateBinding,
    },
  };
}

export function unDecorateTask({
  status,
  statusDate,
  approvalStatus,
  approvalStatusDate,
  startDateBindingData,
  dueDateBindingData,
  ...task
}: Object): Object {
  return {
    ...task,
    inProgressAt: statusDate.in_progress.at,
    inProgressBy: statusDate.in_progress.by,
    completedAt: statusDate.completed.at,
    completedBy: statusDate.completed.by,
    skippedAt: statusDate.skipped.at,
    skippedBy: statusDate.skipped.by,
    approvedAt: approvalStatusDate.approved.at,
    approvedBy: approvalStatusDate.approved.by,
    rejectedAt: approvalStatusDate.rejected.at,
    rejectedBy: approvalStatusDate.rejected.by,
    startDate: startDateBindingData.date,
    startDateInterval: startDateBindingData.interval,
    startDateBinding: startDateBindingData.binding,
    dueDate: dueDateBindingData.date,
    dueDateInterval: dueDateBindingData.interval,
    dueDateBinding: dueDateBindingData.binding,
  };
}

export function decorateMilestone(milestone: Object): Object {
  return {
    ...milestone,
    status: computeMilestoneStatus(milestone),
    statusDate: {
      completed: {
        at: milestone.completedAt,
        by: milestone.completedBy,
      },
    },
    dueDateBindingData: {
      date: milestone.dueDate,
      interval: milestone.dueDateInterval,
      binding: milestone.dueDateBinding,
    },
    estimatedCompletionDateBindingData: {
      date: milestone.estimatedCompletionDate,
      interval: milestone.estimatedCompletionDateInterval,
      binding: milestone.estimatedCompletionDateBinding,
    },
    tasks: milestone.tasks.map(task => {
      if (task.__typename === 'Task') {
        return decorateTask(task);
      }

      return task;
    }),
  };
}

export function unDecorateMilestone({
  status,
  statusDate,
  dueDateBindingData,
  estimatedCompletionDateBindingData,
  ...milestone
}: Object): Object {
  return {
    ...milestone,
    completedAt: statusDate.completed.at,
    completedBy: statusDate.completed.by,
    dueDate: dueDateBindingData.date,
    dueDateInterval: dueDateBindingData.interval,
    dueDateBinding: dueDateBindingData.binding,
    estimatedCompletionDate: estimatedCompletionDateBindingData.date,
    estimatedCompletionDateInterval: estimatedCompletionDateBindingData.interval,
    estimatedCompletionDateBinding: estimatedCompletionDateBindingData.binding,
  };
}

function decorateProject(project: Object): Object {
  return {
    ...project,
    milestones: project.milestones.map(decorateMilestone),
  };
}

export default function decorate(projects: Array<Object>): Array<Object> {
  return projects.map(project => {
    if (project.__typename === 'Project') {
      return decorateProject(project);
    }

    return project;
  });
}
