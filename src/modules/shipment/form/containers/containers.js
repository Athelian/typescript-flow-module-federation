// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals, getByPath, getByPathWithDefault } from 'utils/fp';

type ContainersState = {
  containers: Array<Object>,
};

export const initValues: ContainersState = {
  containers: [],
};

export default class ShipmentContainersContainer extends Container<ContainersState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
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

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (containers: Array<Object>) => {
    this.setState({ containers });
    this.originalValues = { containers };
  };

  onChangePartner = (partner: Object, selectedExporter: Object) => {
    const { containers } = this.state;

    this.setState({
      containers: containers.map(container => ({
        ...container,
        batches: getByPathWithDefault([], 'batches', container).filter(
          batch =>
            getByPath('orderItem.order.export.id', batch) ===
            getByPathWithDefault('', 'id', selectedExporter)
        ),
        warehouseArrivalActualDateAssignedTo: container.warehouseArrivalActualDateAssignedTo.filter(
          user => getByPath('group.id', user) !== partner.id
        ),
        warehouseArrivalAgreedDateAssignedTo: container.warehouseArrivalAgreedDateAssignedTo.filter(
          user => getByPath('group.id', user) !== partner.id
        ),
        departureDateAssignedTo: container.warehouseArrivalAgreedDateAssignedTo.filter(
          user => getByPath('group.id', user) !== partner.id
        ),
        warehouseArrivalActualDateApprovedAt:
          getByPath('warehouseArrivalActualDateApprovedBy.group.id', container) === partner.id
            ? null
            : container.warehouseArrivalActualDateApprovedAt,
        warehouseArrivalActualDateApprovedBy:
          getByPath('warehouseArrivalActualDateApprovedBy.group.id', container) === partner.id
            ? null
            : container.warehouseArrivalActualDateApprovedBy,
        warehouseArrivalAgreedDateApprovedAt:
          getByPath('warehouseArrivalAgreedDateApprovedBy.group.id', container) === partner.id
            ? null
            : container.warehouseArrivalAgreedDateApprovedAt,
        warehouseArrivalAgreedDateApprovedBy:
          getByPath('warehouseArrivalAgreedDateApprovedBy.group.id', container) === partner.id
            ? null
            : container.warehouseArrivalAgreedDateApprovedBy,
        departureDateApprovedAt:
          getByPath('departureDateApprovedBy.group.id', container) === partner.id
            ? null
            : container.departureDateApprovedAt,
        departureDateApprovedBy:
          getByPath('departureDateApprovedBy.group.id', container) === partner.id
            ? null
            : container.departureDateApprovedBy,
      })),
    });
  };
}
