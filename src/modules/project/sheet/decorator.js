// @flow

function decorateTask(task: Object): Object {
  return {
    ...task,
    approved: {
      user: task.approvedBy,
      date: task.approvedAt,
    },
  };
}

function decorateMilestone(milestone: Object): Object {
  return {
    ...milestone,
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
