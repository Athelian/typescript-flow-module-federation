// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { cleanFalsyAndTypeName } from 'utils/data';
import type { MetricValue } from 'types';

type Price = {
  amount: number,
  currency: string,
};

export type ProductProvider = {
  packageName: string,
  packageCapacity: number,
  packageGrossWeight: MetricValue,
  packageVolume: MetricValue,
  packageSize: {
    width: MetricValue,
    height: MetricValue,
    length: MetricValue,
  },
};

export type State = {
  no?: ?string,
  quantity: number,
  price: Price,
  deliveryDate: string,
  customFields: ?Object,
  tags?: Array<Object>,
  memo?: string,
  productProvider?: Object,
  order?: Object,
};

export const initValues = {
  no: null,
  quantity: 0,
  price: {
    currency: 'USD',
    amount: 0,
  },
  deliveryDate: null,
  customFields: {
    mask: null,
    fieldValues: [],
  },
  tags: [],
  memo: null,

  productProvider: null,
  order: null,
};

export default class OrderItemInfoContainer extends Container<State> {
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
