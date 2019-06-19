// @flow
import { Container } from 'unstated';
import update from 'immutability-helper';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';
import emitter from 'utils/emitter';

type TasksState = {
  tasks: Array<Object>,
};

const initValues = {
  tasks: [],
};

const isSameOrdering = (firstArray: Array<Object>, secondArray: Array<Object>) => {
  const firstUnifyIds = firstArray.map(item => item.id).join(',');
  const secondUnifyIds = secondArray.map(item => item.id).join(',');
  return firstUnifyIds === secondUnifyIds;
};
export default class RMEditTasksContainer extends Container<TasksState> {
  state = initValues;

  originalValues = initValues;

  listener = null;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (tasks: Array<Object>) => {
    this.setState({ tasks });
    this.originalValues = { tasks };
  };

  selectTasks = (tasks: Array<Object>) => {
    const taskIds = this.state.tasks.map(item => item.id);
    // if we have different ordering, it means the state is changing by filter/sort
    // then we need to merge state
    return this.state.tasks.length > 0 && isSameOrdering(this.state.tasks, tasks)
      ? this.state.tasks
      : (tasks.map(task =>
          taskIds.includes(task.id)
            ? { ...task, ...this.state.tasks.find(item => item.id === task.id) }
            : task
        ): Array<Object>);
  };

  updateTaskById = async ({
    id,
    updateTask,
    tasks,
  }: {
    id: string,
    updateTask: Object,
    tasks: Array<Object>,
  }) => {
    // defer init data until someone has changed task by inline edit or on slide form
    if (this.state.tasks.length === 0) {
      await this.initDetailValues(tasks);
    }

    // This event will reset data for a case closing RM TASK list on slide view
    if (!this.listener) {
      this.listener = emitter.addListener('RESET_RM_TASKS', () => {
        this.initDetailValues([]);
      });
    }

    const taskPosition = this.state.tasks.findIndex(task => task.id === id);

    if (!isEquals(updateTask, this.state.tasks[taskPosition])) {
      this.setState(prevState => {
        return update(prevState, { tasks: { $splice: [[taskPosition, 1, updateTask]] } });
      });
    }
  };
}
