// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';
import { cloneDeep, set } from 'lodash';

type FormState = {
  tasks?: Array<Object>,
};

const initValues = {
  tasks: [],
};

export default class BatchTasksContainer extends Container<FormState> {
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

  setFieldArrayValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  initDetailValues = (tasks: Array<Object>) => {
    const parsedValues: Array<Object> = tasks;
    this.setState({ tasks: parsedValues });
    this.originalValues = { tasks: parsedValues };
  };
}
