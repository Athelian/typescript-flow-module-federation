// @flow
import ApolloClient from 'apollo-client';
import { camelCase, upperFirst } from 'lodash';
import { filterAsync, mapAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import type {
  EntityEvent,
  EntityEventChange,
  EntityEventHandler,
} from 'components/Sheet/SheetLive/types';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import { extraChange, mergeChanges, newCustomValue } from 'components/Sheet/SheetLive/helper';
import { filesByIDsQuery, usersByIDsQuery } from 'modules/sheet/common/query';
import { decorateMilestone, decorateTask } from './decorator';
import { computeMilestoneStatus, computeTaskApprovalStatus, computeTaskStatus } from './helper';
import { milestoneByIDQuery, tagsByIDsQuery, taskByIDQuery, userByIDQuery } from './query';

// $FlowFixMe not compatible with hook implementation
function onCreateMilestoneFactory(client: ApolloClient, dispatch: Action => void) {
  return (milestoneId: string) =>
    client
      .query({
        query: milestoneByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: milestoneId,
        },
      })
      .then(({ data }) => {
        const newMilestone = data?.milestone;
        if (newMilestone?.__typename !== 'Milestone') {
          return;
        }

        dispatch({
          type: Actions.PRE_ADD_ENTITY,
          payload: {
            entity: {
              id: milestoneId,
              type: 'Milestone',
            },
            callback: (projects: Array<Object>) => {
              const projectId = newMilestone.project?.id;
              if (!projectId) {
                return null;
              }

              const projectIdx = projects.findIndex(project => project.id === projectId);
              if (projectIdx === -1) {
                return null;
              }

              const milestones = [...projects[projectIdx].milestones];
              milestones.splice(newMilestone.sort, 0, decorateMilestone(newMilestone));

              return {
                item: {
                  ...projects[projectIdx],
                  milestones,
                },
                index: projectIdx,
              };
            },
          },
        });
      });
}

// $FlowFixMe not compatible with hook implementation
function onCreateTaskFactory(client: ApolloClient, dispatch: Action => void) {
  return (taskId: string) =>
    client
      .query({
        query: taskByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: taskId,
        },
      })
      .then(({ data }) => {
        const newTask = data?.task;
        if (newTask?.__typename !== 'Task') {
          return;
        }

        dispatch({
          type: Actions.PRE_ADD_ENTITY,
          payload: {
            entity: {
              id: taskId,
              type: 'Task',
            },
            callback: (projects: Array<Object>) => {
              const milestoneId = newTask.milestone?.id;
              const projectId = newTask.milestone?.project?.id;
              if (!milestoneId || !projectId) {
                return null;
              }

              const projectIdx = projects.findIndex(project => project.id === projectId);
              if (projectIdx === -1) {
                return null;
              }

              const milestoneIdx = projects[projectIdx].milestones.findIndex(
                milestone => milestone.id === milestoneId
              );
              if (milestoneIdx === -1) {
                return null;
              }

              const milestones = [...projects[projectIdx].milestones];
              const tasks = [...milestones[milestoneIdx].tasks];
              tasks.splice(newTask.sort, 0, decorateTask(newTask));
              milestones[milestoneIdx] = {
                ...milestones[milestoneIdx],
                tasks,
              };

              return {
                item: {
                  ...projects[projectIdx],
                  milestones,
                },
                index: projectIdx,
              };
            },
          },
        });
      });
}

function onDeleteMilestoneFactory(dispatch: Action => void) {
  return (milestoneId: string) => {
    dispatch({
      type: Actions.PRE_REMOVE_ENTITY,
      payload: {
        entity: {
          id: milestoneId,
          type: 'Milestone',
        },
        callback: (projects: Array<Object>) => {
          const projectIdx = projects.findIndex(
            project => !!project.milestones.find(milestone => milestone.id === milestoneId)
          );
          if (projectIdx === -1) {
            return null;
          }

          return {
            item: {
              ...projects[projectIdx],
              milestones: projects[projectIdx].milestones.filter(
                milestone => milestone.id !== milestoneId
              ),
            },
            index: projectIdx,
          };
        },
      },
    });
  };
}

function onDeleteTaskFactory(dispatch: Action => void) {
  return (taskId: string) => {
    dispatch({
      type: Actions.PRE_REMOVE_ENTITY,
      payload: {
        entity: {
          id: taskId,
          type: 'Task',
        },
        callback: (projects: Array<Object>) => {
          const projectIdx = projects.findIndex(
            project =>
              !!project.milestones.find(
                milestone => !!milestone.tasks.find(task => task.id === taskId)
              )
          );
          if (projectIdx === -1) {
            return null;
          }

          return {
            item: {
              ...projects[projectIdx],
              milestones: projects[projectIdx].milestones.map(milestone => ({
                ...milestone,
                tasks: milestone.tasks.filter(task => task.id !== taskId),
              })),
            },
            index: projectIdx,
          };
        },
      },
    });
  };
}

const cleanUpInterval = (interval: { days: number, weeks: number, months: number }) => {
  const { days, months, weeks } = interval;
  if (Math.abs(days)) return { days };
  if (Math.abs(weeks)) return { weeks };
  if (Math.abs(months)) return { months };
  return { days: 0 };
};

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const onCreateMilestone = onCreateMilestoneFactory(client, dispatch);
  const onCreateTask = onCreateTaskFactory(client, dispatch);
  const onDeleteMilestone = onDeleteMilestoneFactory(dispatch);
  const onDeleteTask = onDeleteTaskFactory(dispatch);

  return async (event: EntityEvent, projects: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'Milestone':
            await onCreateMilestone(event.entity.id);
            break;
          case 'Task':
            await onCreateTask(event.entity.id);
            break;
          default:
            break;
        }
        break;
      case 'Update': {
        let { changes } = event;

        switch (event.entity.__typename) {
          case 'Project':
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                case 'updatedBy':
                  if (change.new) {
                    return client
                      .query({
                        query: userByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: change.field,
                        new: newCustomValue(data.user),
                      }));
                  }
                  break;
                default:
                  break;
              }

              return change;
            });
            break;
          case 'Milestone': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'files':
                  return client
                    .query({
                      query: filesByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.filesByIDs),
                    }));
                case 'completedBy':
                case 'updatedBy':
                  if (change.new) {
                    return client
                      .query({
                        query: userByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: change.field,
                        new: newCustomValue(data.user),
                      }));
                  }
                  break;
                default:
                  break;
              }

              return change;
            });

            const milestone = projects
              .flatMap(p => p.milestones)
              .find(m => m.id === event.entity.id);
            if (milestone) {
              changes = extraChange(
                changes,
                ['completedAt', 'completedBy'],
                newValues =>
                  computeMilestoneStatus({
                    ...milestone,
                    ...newValues,
                  }),
                'status'
              );

              changes = mergeChanges(
                changes,
                {
                  completedAt: (i, v) => ({
                    ...i,
                    completed: {
                      ...i.completed,
                      at: v,
                    },
                  }),
                  completedBy: (i, v) => ({
                    ...i,
                    completed: {
                      ...i.completed,
                      by: v,
                    },
                  }),
                },
                'statusDate',
                milestone.statusDate
              );
            }
            break;
          }
          case 'Task': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'milestone':
                  onDeleteTask(event.entity.id);
                  await onCreateTask(event.entity.id);
                  return false;
                default:
                  return true;
              }
            });

            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                case 'inProgressBy':
                case 'completedBy':
                case 'approvedBy':
                case 'rejectedBy':
                case 'skippedBy':
                case 'updatedBy':
                  if (change.new) {
                    return client
                      .query({
                        query: userByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: change.field,
                        new: newCustomValue(data.user),
                      }));
                  }
                  break;
                case 'assignedTo':
                case 'approvers':
                  return client
                    .query({
                      query: usersByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.usersByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });

            const task = projects
              .flatMap(project => project.milestones.flatMap(milestone => milestone.tasks))
              .find(t => t.id === event.entity?.id);
            if (task) {
              changes = mergeChanges(
                changes,
                {
                  startDate: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                  startDateInterval: (i, v) => ({
                    ...i,
                    interval: v ? cleanUpInterval(v) : v,
                  }),
                  startDateBinding: (i, v) => ({
                    ...i,
                    binding: v ? upperFirst(camelCase(v)) : v,
                  }),
                },
                'startDateBindingData',
                task.startDateBindingData
              );

              changes = mergeChanges(
                changes,
                {
                  dueDate: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                  dueDateInterval: (i, v) => ({
                    ...i,
                    interval: v ? cleanUpInterval(v) : v,
                  }),
                  dueDateBinding: (i, v) => ({
                    ...i,
                    binding: v ? upperFirst(camelCase(v)) : v,
                  }),
                },
                'dueDateBindingData',
                task.dueDateBindingData
              );

              changes = extraChange(
                changes,
                [
                  'completedAt',
                  'completedBy',
                  'inProgressAt',
                  'inProgressBy',
                  'skippedAt',
                  'skippedBy',
                ],
                newValues =>
                  computeTaskStatus({
                    ...task,
                    ...newValues,
                  }),
                'status'
              );

              changes = extraChange(
                changes,
                ['rejectedAt', 'rejectedBy', 'approvedAt', 'approvedBy'],
                newValues =>
                  computeTaskApprovalStatus({
                    ...task,
                    ...newValues,
                  }),
                'approvalStatus'
              );

              changes = mergeChanges(
                changes,
                {
                  inProgressAt: (i, v) => ({
                    ...i,
                    in_progress: {
                      ...i.in_progress,
                      at: v,
                    },
                  }),
                  inProgressBy: (i, v) => ({
                    ...i,
                    in_progress: {
                      ...i.in_progress,
                      by: v,
                    },
                  }),
                  completedAt: (i, v) => ({
                    ...i,
                    completed: {
                      ...i.completed,
                      at: v,
                    },
                  }),
                  completedBy: (i, v) => ({
                    ...i,
                    completed: {
                      ...i.completed,
                      by: v,
                    },
                  }),
                  skippedAt: (i, v) => ({
                    ...i,
                    skipped: {
                      ...i.skipped,
                      at: v,
                    },
                  }),
                  skippedBy: (i, v) => ({
                    ...i,
                    skipped: {
                      ...i.skipped,
                      by: v,
                    },
                  }),
                },
                'statusDate',
                task.statusDate
              );

              changes = mergeChanges(
                changes,
                {
                  approvedAt: (i, v) => ({
                    ...i,
                    approved: {
                      ...i.approved,
                      at: v,
                    },
                  }),
                  approvedBy: (i, v) => ({
                    ...i,
                    approved: {
                      ...i.approved,
                      by: v,
                    },
                  }),
                  rejectedAt: (i, v) => ({
                    ...i,
                    rejected: {
                      ...i.rejected,
                      at: v,
                    },
                  }),
                  rejectedBy: (i, v) => ({
                    ...i,
                    rejected: {
                      ...i.rejected,
                      by: v,
                    },
                  }),
                },
                'approvalStatusDate',
                task.approvalStatusDate
              );
            }
            break;
          }
          default:
            break;
        }

        if (changes.length > 0) {
          dispatch({
            type: Actions.CHANGE_VALUES,
            payload: {
              changes: changes.map(change => {
                return defaultEntityEventChangeTransformer(event, change);
              }),
            },
          });
        }
        break;
      }
      case 'Delete':
        switch (event.entity.__typename) {
          case 'Milestone':
            onDeleteMilestone(event.entity.id);
            break;
          case 'Task':
            await onDeleteTask(event.entity.id);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
}
