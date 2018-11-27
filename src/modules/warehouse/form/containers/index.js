// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsy, cleanUpData } from 'utils/data';
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
  customFields: Object,
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

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    this.setState(cleanUpData(values));
    this.originalValues = cleanUpData(values);
  };
}
