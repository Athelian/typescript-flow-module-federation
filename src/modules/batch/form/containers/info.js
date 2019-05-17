// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName } from 'utils/data';
import { calculatePackageQuantity, calculatePackageVolume } from 'utils/batch';

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

export type BatchFormState = {
  no?: ?string,
  quantity: number,
  deliveredAt?: ?Date | string,
  desiredAt?: ?Date | string,
  expiredAt?: ?Date | string,
  producedAt?: ?Date | string,
  customFields: ?Object,
  tags?: Array<Object>,
  memo?: string,
  orderItem?: Object,
  batchQuantityRevisions: Array<any>,
  packageName?: ?string,
  packageCapacity?: number,
  packageQuantity: number,
  packageGrossWeight: Metric,
  packageVolume: Metric,
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
  autoCalculatePackageQuantity: boolean,
  autoCalculatePackageVolume: boolean,
  todo: {
    tasks: Array<Object>,
  },
};

export const initValues = {
  no: null,
  quantity: 0,
  deliveredAt: null,
  desiredAt: null,
  expiredAt: null,
  producedAt: null,
  customFields: {
    fieldValues: [],
    fieldDefinitions: [],
  },
  tags: [],
  memo: null,
  orderItem: null,
  batchQuantityRevisions: [],
  packageName: null,
  packageCapacity: 0,
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
  todo: {
    tasks: [],
  },
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
    const { quantity, batchQuantityRevisions } = this.state;
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
        ? calculatePackageQuantity({ quantity, batchQuantityRevisions, packageCapacity })
        : prevState.packageQuantity,
      packageGrossWeight,
      packageVolume,
      packageSize,
    }));
  };

  getPackageQuantity = () => calculatePackageQuantity(this.state);

  toggleAutoCalculatePackageQuantity = () => {
    const { autoCalculatePackageQuantity } = this.state;
    if (autoCalculatePackageQuantity) {
      this.setState({
        autoCalculatePackageQuantity: false,
      });
    } else {
      this.setState(prevState => ({
        autoCalculatePackageQuantity: true,
        packageQuantity: calculatePackageQuantity(prevState),
      }));
    }
  };

  calculatePackageQuantity = (setFieldTouched?: Function) => {
    const { autoCalculatePackageQuantity } = this.state;
    if (autoCalculatePackageQuantity) {
      this.setState(prevState => ({
        packageQuantity: calculatePackageQuantity(prevState),
      }));
      if (setFieldTouched) {
        setFieldTouched('packageQuantity');
      }
    }
  };

  toggleAutoCalculatePackageVolume = () => {
    const { autoCalculatePackageVolume } = this.state;
    if (!autoCalculatePackageVolume) {
      this.setState(prevState => ({
        packageVolume: calculatePackageVolume(prevState),
        autoCalculatePackageVolume: !autoCalculatePackageVolume,
      }));
    } else {
      this.setState({
        autoCalculatePackageVolume: !autoCalculatePackageVolume,
      });
    }
  };

  calculatePackageVolume = () => {
    this.setState(prevState => ({
      packageVolume: calculatePackageVolume(prevState),
    }));
  };
}
