// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';
import { cloneDeep, set } from 'lodash';

type FormState = {
  todo: {
    tasks?: Array<Object>,
  },
};

const initValues = {
  todo: {
    tasks: [],
  },
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

  initDetailValues = (todo: { tasks: Array<Object> }) => {
    this.setState(todo);
    this.originalValues = todo;
  };
}
