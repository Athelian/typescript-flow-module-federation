// @flow
import type { Warehouse } from 'generated/graphql';
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';
import { defaultAreaMetric } from 'utils/metric';

export const warehouseInfoInitValues: Warehouse = {
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
  followers: [],
  organizations: [],
};

export default class WarehouseInfoContainer extends Container<Warehouse> {
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
