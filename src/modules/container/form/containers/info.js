// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { formatToDateTimeInput } from 'utils/date';
import { isEquals, isNullOrUndefined } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName } from 'utils/data';

export type ContainerInfoState = {
  archived: boolean,
  autoCalculatedFreeTimeStartDate: boolean,
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

const initValues: ContainerInfoState = {
  autoCalculatedFreeTimeStartDate: false,
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
  orderItem: null,
  isNew: false,
};

export default class ContainerInfoContainer extends Container<ContainerInfoState> {
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

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = this.state;
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const { warehouseArrivalAgreedDate, warehouseArrivalActualDate, ...rest } = values;
    const info = {
      ...(isNullOrUndefined(warehouseArrivalAgreedDate)
        ? {}
        : {
            warehouseArrivalAgreedDate: formatToDateTimeInput(warehouseArrivalAgreedDate),
          }),
      ...(isNullOrUndefined(warehouseArrivalActualDate)
        ? {}
        : {
            warehouseArrivalActualDate: formatToDateTimeInput(warehouseArrivalActualDate),
          }),
      ...rest,
    };

    const parsedValues = { ...initValues, ...info };

    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
