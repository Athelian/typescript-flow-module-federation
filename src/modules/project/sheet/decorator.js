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
