// @flow
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name?: string,
  description?: string,
  entityType?: string,
  tasks?: Array<Object>,
};

const initValues = {
  tasks: [],
};

export default class TaskTemplateFormContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: mixed) => {
    this.setState((prevState: FormState): FormState => set(cloneDeep(prevState), path, value));
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

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
