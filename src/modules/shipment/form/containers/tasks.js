// @flow
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { isEquals, getByPath } from 'utils/fp';
import emitter from 'utils/emitter';

type FormState = {
  todo: {
    milestone: Object,
    tasks: Array<Object>,
    taskTemplate: ?Object,
  },
};

export const initValues: FormState = {
  todo: {
    milestone: null,
    tasks: [],
    taskTemplate: null,
  },
};

export default class ShipmentTasksContainer extends Container<FormState> {
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

  onChangePartner = (partner: Object) => {
    const { todo } = this.state;
    this.setState({
      todo: {
        ...todo,
        tasks: todo.tasks.map(task => ({
          ...task,
          assignedTo: task.assignedTo.filter(
            user => getByPath('group.id', user) !== getByPath('id', partner)
          ),
          approvers: task.approvers.filter(
            user => getByPath('group.id', user) !== getByPath('id', partner)
          ),
          inProgressAt:
            getByPath('inProgressBy.group.id', task) === getByPath('id', partner)
              ? null
              : task.inProgressAt,
          inProgressBy:
            getByPath('inProgressBy.group.id', task) === getByPath('id', partner)
              ? null
              : task.inProgressBy,
          completedAt:
            getByPath('completedBy.group.id', task) === getByPath('id', partner)
              ? null
              : task.completedAt,
          completedBy:
            getByPath('completedBy.group.id', task) === getByPath('id', partner)
              ? null
              : task.completedBy,
          rejectedAt:
            getByPath('rejectedBy.group.id', task) === getByPath('id', partner)
              ? null
              : task.rejectedAt,
          rejectedBy:
            getByPath('rejectedBy.group.id', task) === getByPath('id', partner)
              ? null
              : task.rejectedBy,
          approvedAt:
            getByPath('approvedBy.group.id', task) === getByPath('id', partner)
              ? null
              : task.approvedAt,
          approvedBy:
            getByPath('approvedBy.group.id', task) === getByPath('id', partner)
              ? null
              : task.approvedBy,
        })),
      },
    });
  };

  initDetailValues = (todo: { tasks: Array<Object> }) => {
    const parsedValues: Object = { ...initValues, todo };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
