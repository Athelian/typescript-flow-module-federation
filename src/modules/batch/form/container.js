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
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
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
export const calculatePackageQuantity = ({
  packageCapacity = 0,
  quantity,
  batchAdjustments,
}: Object) => {
  if (packageCapacity > 0) {
    const totalQuantity = batchAdjustments.reduce(
      (total, adjustment) => adjustment.quantity + total,
      quantity
    );
    return totalQuantity > 0 ? totalQuantity / packageCapacity : 0;
  }
  return 0;
};

export type BatchFormState = {
  id?: ?string,
  no?: ?string,
  quantity: number,
  batchAdjustments: Array<any>,
  packageName?: ?string,
  packageCapacity: number,
  packageQuantity: number,
  packageGrossWeight: Metric,
  packageVolume: Metric,
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
  deliveredAt?: ?Date | string,
  desiredAt?: ?Date | string,
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
  quantity: 0,
  deliveredAt: '',
  desiredAt: '',
  expiredAt: '',
  customFields: {
    mask: null,
    fieldValues: [],
    fieldDefinitions: [],
  },
  producedAt: '',
  batchAdjustments: [],
  autoCalculatePackageQuantity: true,
};

export default class BatchFormContainer extends Container<BatchFormState> {
  state = initValues;

  originalValues = initValues;

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

  syncProductProvider = (productProvider: ProductProvider, setFieldTouched: Function) => {
    const { quantity, batchAdjustments } = this.state;
    const {
      packageName = '',
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
    if (setFieldTouched) {
      setFieldTouched('packageName');
      setFieldTouched('packageCapacity');
      setFieldTouched('packageQuantity');
      setFieldTouched('packageGrossWeight');
      setFieldTouched('packageVolume');
      setFieldTouched('packageSize.length');
      setFieldTouched('packageSize.width');
      setFieldTouched('packageSize.height');
    }
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
