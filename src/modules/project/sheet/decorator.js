// @flow
import { computeTaskApprovalStatus, computeMilestoneStatus, computeTaskStatus } from './helper';

export function decorateTask(task: Object): Object {
  return {
    ...task,
    status: computeTaskStatus(task),
    approvalStatus: computeTaskApprovalStatus(task),
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
