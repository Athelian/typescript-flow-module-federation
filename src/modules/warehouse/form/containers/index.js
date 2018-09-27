// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { removeTypename, removeNulls } from 'utils/data';
import { isEquals } from 'utils/fp';

type Metric = {
  value: number,
  metric: string,
};

export type FormState = {
  name?: string,
  street?: string,
  locality?: string,
  region?: string,
  postalCode?: string,
  country?: string,
  surface: Metric,
};

const initValues = {
  surface: {
    value: 0,
    metric: 'm²',
  },
};

export default class WarehouseContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setFieldArrayValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      // $FlowFixMe: missing type define for map's ramda function
      return removeNulls(cloneState);
    });
  };

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues = removeTypename(values);
    // $FlowFixMe: missing type for ramda's map function
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
