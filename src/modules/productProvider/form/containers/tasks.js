// @flow
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { isEquals, getByPath } from 'utils/fp';
import emitter from 'utils/emitter';

type FormState = {
  todo: {
    milestone: Object,
    taskTemplate?: ?Object,
    tasks?: Array<Object>,
  },
};

export const initValues = {
  todo: {
    milestone: null,
    taskTemplate: null,
    tasks: [],
  },
};

export default class ProductProviderTasksContainer extends Container<FormState> {
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

  onChangeExporter = (exporter: Object) => {
    const { todo } = this.state;
    this.setState({
      todo: {
        ...todo,
        tasks: todo.tasks.map(task => ({
          ...task,
          assignedTo: task.assignedTo.filter(user => getByPath('group.id', user) !== exporter.id),
          approvers: task.approvers.filter(user => getByPath('group.id', user) !== exporter.id),
          inProgressAt:
            getByPath('inProgressBy.group.id', task) === exporter.id ? null : task.inProgressAt,
          inProgressBy:
            getByPath('inProgressBy.group.id', task) === exporter.id ? null : task.inProgressBy,
          completedAt:
            getByPath('completedBy.group.id', task) === exporter.id ? null : task.completedAt,
          completedBy:
            getByPath('completedBy.group.id', task) === exporter.id ? null : task.completedBy,
          rejectedAt:
            getByPath('rejectedBy.group.id', task) === exporter.id ? null : task.rejectedAt,
          rejectedBy:
            getByPath('rejectedBy.group.id', task) === exporter.id ? null : task.rejectedBy,
          approvedAt:
            getByPath('approvedBy.group.id', task) === exporter.id ? null : task.approvedAt,
          approvedBy:
            getByPath('approvedBy.group.id', task) === exporter.id ? null : task.approvedBy,
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
