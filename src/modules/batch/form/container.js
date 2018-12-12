// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsy, cleanUpData } from 'utils/data';

type Metric = {
  value: number,
  metric: string,
};

type ProductProvider = {
  packageName: string,
  packageCapacity: number,
  packageGrossWeight: Metric,
  packageVolume: Metric,
};

export function calculateVolume(
  volumeMetric: string,
  height: Metric,
  width: Metric,
  length: Metric
): number {
  const heightValue = height.metric === 'cm' ? height.value : height.value * 100;
  const widthValue = width.metric === 'cm' ? width.value : width.value * 100;
  const lengthValue = length.metric === 'cm' ? length.value : length.value * 100;
  const volumeValue = heightValue * widthValue * lengthValue;

  return volumeMetric === 'cm³' ? volumeValue : volumeValue / 1e6;
}

export type BatchFormState = {
  id?: ?string,
  no?: ?string,
  packageName?: ?string,
  packageCapacity: number,
  packageQuantity: number,
  quantity: number,
  batchAdjustments: Array<any>,
  packageGrossWeight: Metric,
  packageVolume: Metric,
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
  deliveredAt?: ?Date | string,
  expiredAt?: ?Date | string,
  customFields: ?Object,
  producedAt?: ?Date | string,
  orderItem?: Object,
  tags?: Array<Object>,
  memo?: string,
};

const initValues = {
  memo: '',
  packageName: '',
  packageCapacity: 0,
  packageQuantity: 0,
  quantity: 0,
  deliveredAt: '',
  expiredAt: '',
  customFields: {
    mask: null,
    fieldValues: [],
    fieldDefinitions: [],
  },
  producedAt: '',
  batchAdjustments: [],
  packageGrossWeight: { value: 0, metric: 'kg' },
  packageVolume: {
    metric: 'm³',
    value: 0,
  },
  packageSize: {
    width: {
      metric: 'm',
      value: 0,
    },
    height: {
      metric: 'm',
      value: 0,
    },
    length: {
      metric: 'm',
      value: 0,
    },
  },
};

export default class BatchFormContainer extends Container<BatchFormState> {
  state = initValues;

  originalValues = initValues;

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

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };

  syncProductProvider = (productProvider: ProductProvider) => {
    const {
      packageName = '',
      packageCapacity = 0,
      packageGrossWeight = { value: 0, metric: 'kg' },
      packageVolume = { value: 0, metric: 'm³' },
    } = productProvider;

    this.setState({
      packageCapacity,
      packageGrossWeight,
      packageName,
      packageVolume,
    });
  };

  calculatePackageQuantity = () => {
    this.setState(prevState => ({
      packageQuantity:
        prevState.packageCapacity > 0 &&
        prevState.batchAdjustments.reduce(
          (total, adjustment) => adjustment.quantity + total,
          prevState.quantity
        ) > 0
          ? prevState.batchAdjustments.reduce(
              (total, adjustment) => adjustment.quantity + total,
              prevState.quantity
            ) / prevState.packageCapacity
          : 0,
    }));
  };

  calculatePackageVolume = () => {
    this.setState(prevState => ({
      packageVolume: {
        metric: prevState.packageVolume.metric,
        value: calculateVolume(
          prevState.packageVolume.metric,
          prevState.packageSize.height,
          prevState.packageSize.width,
          prevState.packageSize.length
        ),
      },
    }));
  };
}
