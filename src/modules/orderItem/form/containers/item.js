// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { cleanFalsyAndTypeName } from 'utils/data';

type Price = {
  amount: number,
  currency: string,
};

export type Metric = {
  value: number,
  metric: string,
};

export type ProductProvider = {
  packageName: string,
  packageCapacity: number,
  packageGrossWeight: Metric,
  packageVolume: Metric,
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
};

export type State = {
  no?: ?string,
  quantity: number,
  price: Price,
  batches: Array<Object>,
  files?: Array<Document>,
  customFields: ?Object,
  tags?: Array<Object>,
  memo?: string,
  productProvider?: Object,
  order?: Object,

  todo: {
    tasks: Array<Object>,
  },
  shipments?: Array<Object>,
};

export const initValues = {
  no: null,
  quantity: 0,
  price: {
    currency: 'JPY',
    amount: 0,
  },
  customFields: {
    mask: null,
    fieldValues: [],
    fieldDefinitions: [],
  },
  tags: [],
  memo: null,
  batches: [],
  shipments: [],
  files: [],

  productProvider: null,
  order: null,
};

export default class OrderItemContainer extends Container<State> {
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
