// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeTypename, removeNulls } from 'utils/data';

type Price = {
  amount: number,
  currency: string,
};

type Metric = {
  value: number,
  metric: string,
};

type FormState = {
  productProviders: Array<{
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
  }>,
};

const initValues = {
  productProviders: [],
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
  };

  initDetailValues = (values: any) => {
    const parsedValues = removeTypename(values);
    // $FlowFixMe: missing type define for map's ramda function
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
