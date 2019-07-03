// @flow
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { isEquals, getByPath } from 'utils/fp';
import emitter from 'utils/emitter';

type FormState = {
  todo: {
    milestone: Object,
    tasks: Array<Object>,
    taskTemplate?: ?Object,
  },
  hasCalledTasksApiYet: boolean,
};

const initValues: FormState = {
  todo: {
    milestone: null,
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
    const nonTemplateTasks = this.state.todo.tasks.filter(task => !task.taskTemplate);
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

  initDetailValues = (todo: { tasks: Array<Object> }, hasCalledTasksApiYet: boolean = false) => {
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
          assignedTo: task.assignedTo.filter(
            user => getByPath('group.id', user) !== getByPath('id', prevExporter)
          ),
          approvers: task.approvers.filter(
            user => getByPath('group.id', user) !== getByPath('id', prevExporter)
          ),
          inProgressAt:
            getByPath('inProgressBy.group.id', task) === getByPath('id', prevExporter)
              ? null
              : task.inProgressAt,
          inProgressBy:
            getByPath('inProgressBy.group.id', task) === getByPath('id', prevExporter)
              ? null
              : task.inProgressBy,
          completedAt:
            getByPath('completedBy.group.id', task) === getByPath('id', prevExporter)
              ? null
              : task.completedAt,
          completedBy:
            getByPath('completedBy.group.id', task) === getByPath('id', prevExporter)
              ? null
              : task.completedBy,
          rejectedAt:
            getByPath('rejectedBy.group.id', task) === getByPath('id', prevExporter)
              ? null
              : task.rejectedAt,
          rejectedBy:
            getByPath('rejectedBy.group.id', task) === getByPath('id', prevExporter)
              ? null
              : task.rejectedBy,
          approvedAt:
            getByPath('approvedBy.group.id', task) === getByPath('id', prevExporter)
              ? null
              : task.approvedAt,
          approvedBy:
            getByPath('approvedBy.group.id', task) === getByPath('id', prevExporter)
              ? null
              : task.approvedBy,
        })),
      },
    });
  }
}
