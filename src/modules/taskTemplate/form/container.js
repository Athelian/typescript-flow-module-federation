// @flow
import type { TaskTemplate } from 'generated/graphql';
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

const initValues: TaskTemplate = {
  tasks: [],
};

export default class TaskTemplateFormContainer extends Container<TaskTemplate> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: mixed) => {
    this.setState((prevState: TaskTemplate): TaskTemplate =>
      set(cloneDeep(prevState), path, value)
    );
  };

  setFieldValues = (values: Object) => {
    this.setState(values);
  };

  setAllTasksManualDates = () => {
    const { tasks } = this.state;

    this.setState({
      tasks: tasks.map(task => ({
        ...task,
        startDateBinding: null,
        startDateInterval: null,
        dueDateBinding: null,
        dueDateInterval: null,
      })),
    });
  };

  initDetailValues = (values: Object, originalValues: Object = {}) => {
    this.originalValues = { ...initValues, ...originalValues };
    this.setState({ ...initValues, ...values });
  };
}
