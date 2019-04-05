// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName } from 'utils/data';
import { calculatePackageQuantity, calculatePackageVolume } from 'utils/batch';
import type { BatchFormState, ProductProvider } from './type.js.flow';

export const initValues = {
  quantity: 0,
  customFields: {
    fieldValues: [],
    fieldDefinitions: [],
  },
  tags: [],
  batchAdjustments: [],
  packageQuantity: 0,
  packageGrossWeight: { value: 0, metric: 'kg' },
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
  autoCalculatePackageQuantity: true,
  autoCalculatePackageVolume: true,
  // reset values for batch form
  archived: false,
  updatedAt: null,
  updatedBy: null,
  ownedBy: null,
  totalVolume: null,
  totalAdjusted: 0,
  orderItem: null,
  isNew: false,
};

export default class BatchInfoContainer extends Container<BatchFormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = parsedValues;
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

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return removeNulls(cloneState);
    });
  };

  syncProductProvider = (productProvider: ProductProvider) => {
    const { quantity, batchAdjustments } = this.state;
    const {
      packageName,
      packageCapacity = 0,
      packageGrossWeight = { value: 0, metric: 'kg' },
      packageVolume = { value: 0, metric: 'm³' },
      packageSize = {
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
    } = productProvider;

    this.setState(prevState => ({
      packageName,
      packageCapacity,
      packageQuantity: prevState.autoCalculatePackageQuantity
        ? calculatePackageQuantity({ packageCapacity, quantity, batchAdjustments })
        : prevState.packageQuantity,
      packageGrossWeight,
      packageVolume,
      packageSize,
    }));
  };

  getPackageQuantity = () => calculatePackageQuantity(this.state);

  triggerCalculatePackageQuantity = () => {
    this.setState(prevState => ({
      packageQuantity: calculatePackageQuantity(prevState),
    }));
  };

  calculatePackageQuantity = (setFieldTouched?: Function) => {
    if (this.state.autoCalculatePackageQuantity) {
      this.triggerCalculatePackageQuantity();
      if (setFieldTouched) {
        setFieldTouched('packageQuantity');
      }
    }
  };

  calculatePackageVolume = () => {
    this.setState(prevState => ({
      packageVolume: calculatePackageVolume(prevState),
    }));
  };
}
