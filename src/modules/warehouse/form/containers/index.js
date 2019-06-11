// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsyAndTypeName, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';
import { defaultAreaMetric } from 'utils/metric';

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
  inCharges: Array<{ id: string, firstName: string, lastName: string }>,
  groups: Array<Object>,
};

const initValues = {
  name: '',
  street: '',
  locality: '',
  region: '',
  postalCode: '',
  country: null,
  surface: {
    value: 0,
    metric: defaultAreaMetric,
  },
  customFields: {
    mask: null,
    fieldValues: [],
  },
  inCharges: [],
  groups: [],
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

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
