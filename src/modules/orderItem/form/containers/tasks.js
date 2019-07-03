// @flow
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { isEquals } from 'utils/fp';
import emitter from 'utils/emitter';

type FormState = {
  todo: {
    milestone: Object,
    taskTemplate?: ?Object,
    tasks?: Array<Object>,
  },
};

const initValues = {
  todo: {
    milestone: null,
    taskTemplate: null,
    tasks: [],
  },
};

export default class OrderItemTasksContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = this.state;
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

  initDetailValues = (todo: { tasks: Array<Object> }) => {
    const parsedValues: Object = { ...initValues, todo };
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
