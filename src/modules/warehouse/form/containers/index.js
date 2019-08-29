// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
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
  inCharges: [],
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

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...warehouseInfoInitValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
