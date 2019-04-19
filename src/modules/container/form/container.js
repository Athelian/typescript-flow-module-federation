// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName } from 'utils/data';

export type ContainerFormState = {
  archived: boolean,
  autoCalculatedFreeTimeStartDate: boolean,
  batches: Array<Object>,
  departureDate: ?string,
  departureDateApprovedBy: ?Object,
  departureDateApprovedAt: ?string,
  departureDateAssignedTo: Array<Object>,
  freeTimeDuration: number,
  freeTimeStartDate: ?string,
  memo: ?string,
  no: ?string,
  containerType: ?string,
  containerOption: ?string,
  ownedBy: ?Object,
  representativeBatch: ?Object,
  shipment: ?Object,
  tags: Array<Object>,
  updatedAt: ?string,
  updatedBy: ?string,
  warehouse: ?Object,
  warehouseArrivalAgreedDate: ?string,
  warehouseArrivalAgreedDateApprovedAt: ?string,
  warehouseArrivalAgreedDateApprovedBy: ?Object,
  warehouseArrivalAgreedDateAssignedTo: Array<Object>,
  warehouseArrivalActualDate: ?string,
  warehouseArrivalActualDateApprovedAt: ?string,
  warehouseArrivalActualDateApprovedBy: ?Object,
  warehouseArrivalActualDateAssignedTo: Array<Object>,
  yardName: ?string,
};

const initValues: ContainerFormState = {
  autoCalculatedFreeTimeStartDate: false,
  batches: [],
  departureDate: null,
  departureDateApprovedAt: null,
  departureDateApprovedBy: null,
  departureDateAssignedTo: [],
  freeTimeDuration: 14,
  freeTimeStartDate: null,
  memo: null,
  no: null,
  containerType: null,
  containerOption: null,
  representativeBatch: null,
  shipment: null,
  tags: [],
  warehouse: null,
  warehouseArrivalAgreedDate: null,
  warehouseArrivalAgreedDateApprovedAt: null,
  warehouseArrivalAgreedDateApprovedBy: null,
  warehouseArrivalAgreedDateAssignedTo: [],
  warehouseArrivalActualDate: null,
  warehouseArrivalActualDateApprovedAt: null,
  warehouseArrivalActualDateApprovedBy: null,
  warehouseArrivalActualDateAssignedTo: [],
  yardName: null,
  // reset values for container form
  archived: false,
  updatedAt: null,
  updatedBy: null,
  ownedBy: null,
  totalVolume: null,
  totalAdjusted: 0,
  orderItem: null,
  isNew: false,
};

export default class ContainerFormContainer extends Container<ContainerFormState> {
  state = initValues;

  originalValues = initValues;

  existingBatches = initValues.batches;

  addExistingBatches = (batches: Array<Object>) => {
    this.existingBatches = [...this.existingBatches, ...batches];
  };

  removeExistingBatch = (batchId: string) => {
    this.existingBatches = [...this.existingBatches.filter(batch => batch.id !== batchId)];
  };

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

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = this.state;
    this.existingBatches = this.state.batches;
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues = { ...initValues, ...values };

    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
    this.existingBatches = [...parsedValues.batches];
  };
}
