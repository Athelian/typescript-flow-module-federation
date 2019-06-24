// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import type { TaskCount } from 'generated/graphql';
import { isEquals } from 'utils/fp';
import { cleanFalsyAndTypeName } from 'utils/data';

export type State = {
  name: string,
  description?: string,
  dueDate?: Date,
  taskCount: TaskCount,
};

export const initValues = {
  name: '',
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
};

export default class ProjectInfoContainer extends Container<State> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = this.state;
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

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
}
