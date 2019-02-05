// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsy, cleanUpData } from 'utils/data';

type Metric = {
  value: number,
  metric: string,
};

export type ContainerFormState = {
  id?: ?string,
  no?: ?string,
  memo?: string,
  archived: boolean,
  warehouse: Object,
  warehouseArrivalAgreedDate: string,
  warehouseArrivalAgreedDateAssignedTo: Array<Object>,
  warehouseArrivalAgreedDateApprovedBy: Object,
  warehouseArrivalAgreedDateApprovedAt: string,
  warehouseArrivalActualDate: string,
  warehouseArrivalActualDateAssignedTo: Array<Object>,
  warehouseArrivalActualDateApprovedBy: Object,
  warehouseArrivalActualDateApprovedAt: string,
  totalBatchPackages: number,
  totalBatchQuantity: number,
  totalNumberOfUniqueOrderItems: number,
  totalVolume: Metric,
  totalWeight: Metric,
  totalPrice: ?Metric,
  shipment: Object,
  batches: Array<Object>,
  tags?: Array<Object>,
  representativeBatch: Object,
};

const initValues = {
  totalBatchPackages: 0,
  totalBatchQuantity: 0,
  totalNumberOfUniqueOrderItems: 0,
  totalVolume: { value: 0, metric: 'm³' },
  totalWeight: { value: 0, metric: 'kg' },
  totalPrice: null,
  batches: [],
  tags: [],
  representativeBatch: null,
  warehouseArrivalAgreedDateAssignedTo: [],
  warehouseArrivalActualDateAssignedTo: [],
};

export default class ContainerFormContainer extends Container<ContainerFormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: any) => {
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

  removeDeepFieldValue = (path: string) => {
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
}
