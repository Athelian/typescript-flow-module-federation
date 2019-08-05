// @flow
import type { Todo } from 'generated/graphql';
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { isEquals, getByPath, getByPathWithDefault } from 'utils/fp';
import emitter from 'utils/emitter';

type FormState = {|
  todo: Todo,
  hasCalledTasksApiYet: boolean,
|};

export const initValues: FormState = {
  todo: {
    completedCount: 0,
    inProgressCount: 0,
    remainingCount: 0,
    taskCount: {
      count: 0,
      remain: 0,
      inProgress: 0,
      completed: 0,
      rejected: 0,
      approved: 0,
      skipped: 0,
      delayed: 0,
    },
    tasks: [],
  },
  hasCalledTasksApiYet: false,
};

export default class OrderTasksContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: mixed) => {
    this.setState((prevState: FormState): FormState => set(cloneDeep(prevState), path, value));
  };

  applyTemplate = (template: Object) => {
    const {
      todo: { milestone },
    } = this.state;
    const nonTemplateTasks = this.state.todo.tasks.filter(task => !getByPath('taskTemplate', task));
    const templateTasks = template.tasks.map(task => ({ ...task, milestone }));
    const newTaskList = [...nonTemplateTasks, ...templateTasks];

    this.setState({ todo: { tasks: newTaskList, taskTemplate: template, milestone } });
    setTimeout(() => {
      emitter.emit('AUTO_DATE');
    }, 200);
  };

  changeExporter = (prevExporter: Object) => {
    let retry;
    if (this.state.hasCalledTasksApiYet) {
      this.cleanOldStaff(prevExporter);
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledTasksApiYet) {
          this.cleanOldStaff(prevExporter);
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };

  initDetailValues = (todo: Todo, hasCalledTasksApiYet: boolean = false) => {
    const parsedValues: Object = { ...initValues, todo, hasCalledTasksApiYet };
    this.setState(parsedValues);
    if (hasCalledTasksApiYet) {
      this.originalValues = parsedValues;
    }
  };

  waitForTasksSectionReady = (name: string, value: ?Date) => {
    let retry;
    if (this.state.hasCalledTasksApiYet) {
      setTimeout(() => {
        emitter.emit('AUTO_DATE', name, value);
      }, 200);
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledTasksApiYet) {
          setTimeout(() => {
            emitter.emit('AUTO_DATE', name, value);
          }, 200);
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };

  cleanOldStaff(prevExporter: ?Object) {
    const { todo } = this.state;
    this.setState({
      todo: {
        ...todo,
        tasks: todo.tasks.map(task => ({
          ...task,
          assignedTo: getByPathWithDefault([], 'assignedTo', task).filter(
            user => getByPath('organization.id', user) !== getByPath('id', prevExporter)
          ),
          approvers: getByPathWithDefault([], 'approvers', task).filter(
            user => getByPath('organization.id', user) !== getByPath('id', prevExporter)
          ),
          inProgressAt:
            getByPath('inProgressBy.organization.id', task) === getByPath('id', prevExporter)
              ? null
              : getByPath('inProgressAt', task),
          inProgressBy:
            getByPath('inProgressBy.organization.id', task) === getByPath('id', prevExporter)
              ? null
              : getByPath('inProgressBy', task),
          completedAt:
            getByPath('completedBy.organization.id', task) === getByPath('id', prevExporter)
              ? null
              : getByPath('completedAt', task),
          completedBy:
            getByPath('completedBy.organization.id', task) === getByPath('id', prevExporter)
              ? null
              : getByPath('completedBy', task),
          rejectedAt:
            getByPath('rejectedBy.organization.id', task) === getByPath('id', prevExporter)
              ? null
              : getByPath('rejectedAt', task),
          rejectedBy:
            getByPath('rejectedBy.organization.id', task) === getByPath('id', prevExporter)
              ? null
              : getByPath('rejectedBy', task),
          approvedAt:
            getByPath('approvedBy.organization.id', task) === getByPath('id', prevExporter)
              ? null
              : getByPath('approvedAt', task),
          approvedBy:
            getByPath('approvedBy.organization.id', task) === getByPath('id', prevExporter)
              ? null
              : getByPath('approvedBy', task),
        })),
      },
    });
  }
}
