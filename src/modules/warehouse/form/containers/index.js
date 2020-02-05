// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';
import { defaultAreaMetric } from 'utils/metric';
import type { MetricValue } from 'types';

export type FormState = {
  name?: string,
  street?: string,
  locality?: string,
  region?: string,
  postalCode?: string,
  country?: string,
  surface: MetricValue,
  customFields: Object,
  organizations: Array<Object>,
};

export const warehouseInfoInitValues = {
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
  organizations: [],
};

export default class WarehouseInfoContainer extends Container<FormState> {
  state = warehouseInfoInitValues;

  originalValues = warehouseInfoInitValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

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

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...warehouseInfoInitValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
