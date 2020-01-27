// @flow
import { omit, flatten, set, cloneDeep } from 'lodash';
import { Container } from 'unstated';
import update from 'immutability-helper';
import type { User, Milestone, Task, FilePayload } from 'generated/graphql';
import { isEquals, getByPathWithDefault, getByPath } from 'utils/fp';
import { uuid } from 'utils/id';
import { calculateTasks, setToSkipTask, setToComplete, START_DATE, DUE_DATE } from 'utils/task';
import { calculateNewDate } from 'utils/date';

type FormState = {
  milestones: Array<Milestone>,
  needDeletedFiles: Array<FilePayload>,
  ignoreTaskIds: [],
};

export const initValues: FormState = {
  milestones: [],
  needDeletedFiles: [],
  ignoreTaskIds: [],
};

const generateTask = (task: Object) => {
  const defaultMappingFields = {
    MilestoneDueDate: 'milestone.dueDate',
  };

  const {
    startDate,
    startDateBinding,
    startDateInterval,
    dueDate,
    dueDateBinding,
    dueDateInterval,
  } = task;

  let newStartDate = startDate;
  let newDueDate = dueDate;

  if (startDateBinding === DUE_DATE) {
    // calculate dueDate -> calculate startDate
    if (dueDateBinding) {
      const path = defaultMappingFields[dueDateBinding];
      if (path) {
        newDueDate = calculateNewDate({
          date: getByPath(path, task),
          dateInterval: dueDateInterval,
        });
      }
    }
    newStartDate = calculateNewDate({
      date: newDueDate,
      dateInterval: startDateInterval,
    });

    return {
      ...task,
      startDate: newStartDate,
      dueDate: newDueDate,
    };
  }

  if (dueDateBinding === START_DATE) {
    // calculate startDate -> calculate dueDate
    if (startDateBinding) {
      const path = defaultMappingFields[startDateBinding];
      if (path) {
        newStartDate = calculateNewDate({
          date: getByPath(path, task),
          dateInterval: startDateInterval,
        });
      }
    }

    newDueDate = calculateNewDate({
      date: newStartDate,
      dateInterval: dueDateInterval,
    });
    return {
      ...task,
      startDate: newStartDate,
      dueDate: newDueDate,
    };
  }

  if (startDateBinding) {
    const path = defaultMappingFields[startDateBinding];
    if (path) {
      newStartDate = calculateNewDate({
        date: getByPath(path, task),
        dateInterval: startDateInterval,
      });
    }
  }

  if (dueDateBinding) {
    const path = defaultMappingFields[dueDateBinding];
    if (path) {
      newDueDate = calculateNewDate({
        date: getByPath(path, task),
        dateInterval: dueDateInterval,
      });
    }
  }

  return {
    ...task,
    startDate: newStartDate,
    dueDate: newDueDate,
  };
};

export default class ProjectMilestonesContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  originalTasks = [];

  deleteTasks = [];

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
  };

  setNeedDeletedFiles = (noNeedDeletedFiles: Array<FilePayload>) => {
    const noNeedDeletedFileIDs = new Set(noNeedDeletedFiles.map(({ id }) => id));

    this.setState(prevState => ({
      needDeletedFiles: prevState.needDeletedFiles.filter(
        ({ id }) => !noNeedDeletedFileIDs.has(id)
      ),
    }));
  };

  unsetNeedDeletedFiles = (needDeletedFiles: Array<FilePayload>) => {
    const prevNeedDeletedFiles = this.state.needDeletedFiles;
    const prevNeedDeletedFileIDs = new Set(prevNeedDeletedFiles.map(({ id }) => id));

    this.setState({
      needDeletedFiles: [
        ...prevNeedDeletedFiles,
        ...needDeletedFiles.filter(({ id }) => !prevNeedDeletedFileIDs.has(id)),
      ],
    });
  };

  resetNeedDeletedFiles = () => {
    this.setState({
      needDeletedFiles: [],
    });
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setDeepFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  initDetailValues = (
    milestones: Array<Milestone>,
    needDeletedFiles: Array<FilePayload>,
    ignoreTaskIds: Array<string> = []
  ) => {
    this.setState({ milestones, needDeletedFiles: [], ignoreTaskIds });
    this.originalValues = { milestones, needDeletedFiles: [], ignoreTaskIds };
    this.originalTasks = (flatten(
      milestones.map(item => getByPathWithDefault([], 'tasks', item))
    ): Array<Task>);
    this.deleteTasks = [];
  };

  taskCountByMilestone = (
    id: string
  ): {
    count: number,
    remain: number,
    inProgress: number,
    completed: number,
    rejected: number,
    approved: number,
    skipped: number,
    delayed: number,
    unapproved: number,
  } => {
    const tasks: Array<Task> = getByPathWithDefault(
      [],
      'tasks',
      this.state.milestones.find(milestone => milestone.id === id)
    );
    return calculateTasks(tasks);
  };

  taskCount = (): {
    count: number,
    remain: number,
    inProgress: number,
    completed: number,
    rejected: number,
    approved: number,
    skipped: number,
    delayed: number,
    unapproved: number,
  } => {
    const tasks: Array<Task> = flatten(
      this.state.milestones.map(item => getByPathWithDefault([], 'tasks', item))
    );
    return calculateTasks(tasks);
  };

  completedMilestone = async ({
    id,
    completedBy,
    completedAt,
    action,
  }: {
    id: string,
    completedBy: ?User,
    completedAt: ?Date,
    action: 'setToSkip' | 'setToComplete' | 'leaveUnChange',
  }) => {
    const tasks: Array<Task> = getByPathWithDefault(
      [],
      'tasks',
      this.state.milestones.find(milestone => milestone.id === id)
    );
    const index = this.state.milestones.findIndex(milestone => milestone.id === id);
    switch (action) {
      case 'setToSkip': {
        await this.setState(prevState =>
          update(prevState, {
            milestones: {
              [index]: {
                tasks: {
                  $set: tasks.map(task => setToSkipTask(task, { completedAt, completedBy })),
                },
              },
            },
          })
        );
        this.setMilestoneValue(id, {
          completedAt,
          completedBy,
        });
        break;
      }
      case 'setToComplete': {
        await this.setState(prevState =>
          update(prevState, {
            milestones: {
              [index]: {
                tasks: {
                  $set: tasks.map(task => setToComplete(task, { completedAt, completedBy })),
                },
              },
            },
          })
        );
        this.setMilestoneValue(id, {
          completedAt,
          completedBy,
        });
        break;
      }

      default:
        this.setMilestoneValue(id, {
          completedAt,
          completedBy,
        });
        break;
    }
  };

  setMilestoneValue = (id: string, value: Object) => {
    const index = this.state.milestones.findIndex(milestone => milestone.id === id);
    this.setState(prevState =>
      update(prevState, {
        milestones: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  removeMilestone = (id: string, removeOnTasks: boolean = false) => {
    const index = this.state.milestones.findIndex(milestone => milestone.id === id);
    const taskIds = this.state.milestones[index].tasks
      .map(task => getByPathWithDefault('', 'id', task))
      .filter(Boolean);
    if (removeOnTasks) {
      this.setState(prevState =>
        update(prevState, {
          milestones: {
            $splice: [[index, 1]],
          },
          ignoreTaskIds: {
            $push: taskIds,
          },
        })
      );
    } else {
      this.setState(prevState =>
        update(prevState, {
          milestones: {
            $splice: [[index, 1]],
          },
        })
      );
    }
  };

  newMilestone = () => {
    this.setState(prevState => ({
      ...prevState,
      milestones: [
        ...prevState.milestones,
        {
          id: uuid(),
          name: `Milestone - ${prevState.milestones.length + 1}`,
          dueDate: null,
          tasks: [],
          files: [],
        },
      ],
    }));
  };

  updateTasks = (tasks: Array<Task>) => {
    this.setState(prevState => ({
      milestones: prevState.milestones.map(milestone => ({
        ...milestone,
        tasks: (milestone.tasks || []).map(task => ({
          ...task,
          ...tasks.find(item => item.id === task.id),
        })),
      })),
    }));
  };

  updateTask = ({
    milestoneId,
    taskId,
    task,
  }: {
    milestoneId: string,
    taskId: string,
    task: Task,
  }) => {
    const index = this.state.milestones.findIndex(milestone => milestone.id === milestoneId);
    const taskIndex = this.state.milestones[index].tasks.findIndex(
      item => getByPathWithDefault('', 'id', item) === taskId
    );
    this.setState(prevState =>
      update(prevState, {
        milestones: {
          [index]: {
            tasks: {
              [taskIndex]: {
                $merge: omit(task, ['milestone']),
              },
            },
          },
        },
      })
    );
  };

  removeTask = ({
    milestoneId,
    taskId,
    isDelete,
  }: {
    milestoneId: string,
    taskId: string,
    isDelete: boolean,
  }) => {
    const index = this.state.milestones.findIndex(milestone => milestone.id === milestoneId);
    const taskIndex = this.state.milestones[index].tasks.findIndex(
      item => getByPathWithDefault('', 'id', item) === taskId
    );
    if (isDelete) {
      this.deleteTasks.push(taskId);
    }
    this.setState(prevState =>
      update(prevState, {
        milestones: {
          [index]: {
            tasks: {
              $splice: [[taskIndex, 1]],
            },
          },
        },
      })
    );
  };

  changeMilestoneOrdering = (ordering: Array<string>) => {
    this.setState(prevState => ({
      milestones: ordering.map(id => prevState.milestones.find(item => item.id === id)),
    }));
  };

  changeMilestones = (columns: Object) => {
    const ordering = Object.keys(columns);
    this.setState(prevState => ({
      milestones: ordering.map(id => {
        const milestone = prevState.milestones.find(item => item.id === id);
        return {
          ...milestone,
          tasks: columns[id].map((task, milestoneSort) => {
            const { milestone: unused, ...rest } = generateTask({
              ...task,
              milestone,
            });
            return {
              ...rest,
              milestoneSort,
            };
          }),
        };
      }),
    }));
  };

  excludeTaskIds = () => {
    const taskIds = flatten(this.state.milestones.map(item => item.tasks))
      .map(task => getByPathWithDefault('', 'id', task))
      .filter(Boolean);
    const tasks = flatten(this.originalValues.milestones.map(item => item.tasks));
    return (tasks
      .filter(task => !taskIds.includes(getByPathWithDefault('', 'id', task)))
      .map(task => getByPathWithDefault('', 'id', task)): Array<string>);
  };

  excludeIds = () => {
    const taskIds = flatten(this.state.milestones.map(item => item.tasks))
      .map(task => getByPathWithDefault('', 'id', task))
      .filter(Boolean);
    return [...taskIds, ...this.state.ignoreTaskIds];
  };

  lastMilestoneDueDate = () => {
    return getByPathWithDefault(
      '',
      `${this.state.milestones.length - 1}.dueDate`,
      this.state.milestones
    );
  };
}
