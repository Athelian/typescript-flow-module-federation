// @flow
import type {
  // ProductProviderPayload,
  MetricValue,
  Size,
  TaskPayload,
  TagPayload,
  OrderItemPayload,
  BatchQuantityRevisionPayload,
} from 'generated/graphql';
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { cleanFalsyAndTypeName } from 'utils/data';
// import { calculatePackageQuantity, calculateVolume } from 'utils/batch';
import { defaultDistanceMetric, defaultVolumeMetric, defaultWeightMetric } from 'utils/metric';

export type BatchFormState = {
  no?: ?string,
  quantity: number,
  deliveredAt?: ?Date | string,
  desiredAt?: ?Date | string,
  expiredAt?: ?Date | string,
  producedAt?: ?Date | string,
  customFields: ?Object,
  tags?: Array<TagPayload>,
  memo: ?string,
  orderItem: ?OrderItemPayload,
  batchQuantityRevisions: Array<BatchQuantityRevisionPayload>,
  packageName?: ?string,
  packageCapacity?: number,
  packageQuantity: number,
  packageGrossWeight: MetricValue,
  packageVolume: MetricValue,
  packageSize: Size,
  autoCalculatePackageQuantity: boolean,
  autoCalculatePackageVolume: boolean,
  todo: {
    tasks: Array<TaskPayload>,
  },
};

export const initValues: BatchFormState = {
  no: null,
  quantity: 0,
  deliveredAt: null,
  desiredAt: null,
  expiredAt: null,
  producedAt: null,
  customFields: {
    mask: null,
    fieldValues: [],
  },
  tags: [],
  memo: null,
  orderItem: null,
  batchQuantityRevisions: [],
  packageName: null,
  packageCapacity: 0,
  packageQuantity: 0,
  packageGrossWeight: { value: 0, metric: defaultWeightMetric },
  packageVolume: {
    metric: defaultVolumeMetric,
    value: 0,
  },
  packageSize: {
    width: {
      metric: defaultDistanceMetric,
      value: 0,
    },
    height: {
      metric: defaultDistanceMetric,
      value: 0,
    },
    length: {
      metric: defaultDistanceMetric,
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

  removeBatchQuantityRevisionByIndex = (index: number) => {
    this.setState(prevState => {
      const batchQuantityRevisions = cloneDeep(prevState.batchQuantityRevisions);
      batchQuantityRevisions.splice(index, 1);
      return {
        batchQuantityRevisions,
      };
    });
  };

  // syncProductProvider = (productProvider: ProductProviderPayload) => {
  //   const { quantity, batchQuantityRevisions } = this.state;
  //   const {
  //     packageName,
  //     packageCapacity = 0,
  //     packageGrossWeight = { value: 0, metric: defaultWeightMetric },
  //     packageVolume = { value: 0, metric: defaultVolumeMetric },
  //     packageSize = {
  //       width: {
  //         metric: defaultDistanceMetric,
  //         value: 0,
  //       },
  //       height: {
  //         metric: defaultDistanceMetric,
  //         value: 0,
  //       },
  //       length: {
  //         metric: defaultDistanceMetric,
  //         value: 0,
  //       },
  //     },
  //   } = productProvider;

  //   this.setState(prevState => ({
  //     packageName,
  //     packageCapacity,
  //     packageQuantity: prevState.autoCalculatePackageQuantity
  //       ? calculatePackageQuantity({ quantity, batchQuantityRevisions, packageCapacity })
  //       : prevState.packageQuantity,
  //     packageGrossWeight,
  //     packageVolume,
  //     packageSize,
  //   }));
  // };

  // getPackageQuantity = () => calculatePackageQuantity(this.state);

  // toggleAutoCalculatePackageQuantity = () => {
  //   const { autoCalculatePackageQuantity } = this.state;
  //   if (autoCalculatePackageQuantity) {
  //     this.setState({
  //       autoCalculatePackageQuantity: false,
  //     });
  //   } else {
  //     this.setState(prevState => ({
  //       autoCalculatePackageQuantity: true,
  //       packageQuantity: calculatePackageQuantity(prevState),
  //     }));
  //   }
  // };

  // calculatePackageQuantity = (setFieldTouched?: Function) => {
  //   const { autoCalculatePackageQuantity } = this.state;
  //   if (autoCalculatePackageQuantity) {
  //     this.setState(prevState => ({
  //       packageQuantity: calculatePackageQuantity(prevState),
  //     }));
  //     if (setFieldTouched) {
  //       setFieldTouched('packageQuantity');
  //     }
  //   }
  // };

  // toggleAutoCalculatePackageVolume = () => {
  //   const { autoCalculatePackageVolume } = this.state;
  //   if (!autoCalculatePackageVolume) {
  //     this.setState(prevState => ({
  //       packageVolume: calculateVolume(prevState.packageVolume, prevState.packageSize),
  //       autoCalculatePackageVolume: !autoCalculatePackageVolume,
  //     }));
  //   } else {
  //     this.setState({
  //       autoCalculatePackageVolume: !autoCalculatePackageVolume,
  //     });
  //   }
  // };

  // calculatePackageVolume = () => {
  //   this.setState(prevState => ({
  //     packageVolume: calculateVolume(prevState.packageVolume, prevState.packageSize),
  //   }));
  // };
}
