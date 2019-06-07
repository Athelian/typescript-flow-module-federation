// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';
import { removeNulls, extractForbiddenId } from 'utils/data';

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
    exporter: { id: string, name: string },
    supplier: { id: string, name: string },
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

export default class ProductProvidersContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  setFieldArrayValue = (index: number, value: any) => {
    this.setState(prevState =>
      update(prevState, {
        productProviders: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return removeNulls(cloneState);
    });
  };

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (productProviders: Array<Object>) => {
    const parsedValues: Array<any> = [
      ...productProviders.map(productProvider => extractForbiddenId(productProvider)),
    ];

    this.setState({ productProviders: parsedValues });
    this.originalValues = { productProviders: parsedValues };
  };
}
