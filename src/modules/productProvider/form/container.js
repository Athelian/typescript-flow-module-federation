// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type Price = {
  amount: number,
  currency: string,
};

type Metric = {
  value: number,
  metric: string,
};

type FormState = {
  unitVolume: Metric,
  unitWeight: Metric,
  unitPrice: Price,
  inspectionFee: Price,
  packageGrossWeight: Metric,
  packageVolume: Metric,
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
};

const initValues = {
  unitVolume: {
    metric: 'm³',
    value: 0,
  },
  unitWeight: {
    metric: 'kg',
    value: 0,
  },
  unitPrice: {
    currency: 'JPY',
    amount: 0,
  },
  inspectionFee: {
    currency: 'JPY',
    amount: 0,
  },
  packageGrossWeight: {
    metric: 'kg',
    value: 0,
  },
  packageVolume: {
    metric: 'm³',
    value: 0,
  },
  packageSize: {
    width: {
      metric: 'cm',
      value: 0,
    },
    height: {
      metric: 'cm',
      value: 0,
    },
    length: {
      metric: 'cm',
      value: 0,
    },
  },
};

export default class ProductProviderContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
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
