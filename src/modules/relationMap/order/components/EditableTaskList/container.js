// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsy } from 'utils/data';
import { isEquals } from 'utils/fp';

type TasksState = {
  tasks: Array<Object>,
};

const initValues = {
  tasks: [],
};

export default class RMTaskListContainer extends Container<TasksState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setDeepFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (tasks: Array<Object>) => {
    this.setState({ tasks });
    this.originalValues = { tasks };
  };
}
