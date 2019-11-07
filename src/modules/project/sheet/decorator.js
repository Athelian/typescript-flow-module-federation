// @flow

export default function decorate(projects: Array<Object>): Array<Object> {
  return projects.map(project => ({
    ...project,
    milestones: project.milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task => ({
        ...task,
      })),
    })),
  }));
}
