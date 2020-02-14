// @flow
import type { ContainerPayload } from 'generated/graphql';
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { formatToDateTimeInput } from 'utils/date';
import { isEquals, isNullOrUndefined } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName, extractForbiddenId } from 'utils/data';

const initValues: ContainerPayload = {
  autoCalculatedFreeTimeStartDate: false,
  departureDate: null,
  departureDateApprovedAt: null,
  departureDateApprovedBy: null,
  freeTimeDuration: 14,
  freeTimeStartDate: null,
  memo: null,
  no: null,
  containerType: null,
  containerOption: null,
  shipment: null,
  tags: [],
  followers: [],
  warehouse: null,
  warehouseArrivalAgreedDate: null,
  warehouseArrivalAgreedDateApprovedAt: null,
  warehouseArrivalAgreedDateApprovedBy: null,
  warehouseArrivalActualDate: null,
  warehouseArrivalActualDateApprovedAt: null,
  warehouseArrivalActualDateApprovedBy: null,
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

export default class ContainerInfoContainer extends Container<ContainerPayload> {
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

    const parsedTags = [...parsedValues.tags.map(tag => extractForbiddenId(tag))];
    this.setState({ ...parsedValues, tags: parsedTags });
    this.originalValues = { ...parsedValues, tags: parsedTags };
  };
}
