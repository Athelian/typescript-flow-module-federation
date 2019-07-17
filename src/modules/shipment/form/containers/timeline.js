// @flow
import type {
  TimelineDatePayload,
  ContainerGroupPayload,
  VoyagePayload,
  GroupPayload,
} from 'generated/graphql';
import { Container } from 'unstated';
import { cloneDeep, unset, set } from 'lodash';
import { isEquals, getByPath, getByPathWithDefault } from 'utils/fp';
import { removeNulls } from 'utils/data';
import emitter from 'utils/emitter';

type FormState = {
  cargoReady: TimelineDatePayload,
  containerGroups: Array<ContainerGroupPayload>,
  voyages: Array<VoyagePayload>,
};

export const initValues: FormState = {
  cargoReady: {},
  containerGroups: [{}],
  voyages: [{}],
};

const removeOldImporterStaff = ({
  entity,
  field,
  partner,
}: {
  entity: TimelineDatePayload,
  field: string,
  partner: GroupPayload,
}) => {
  if (Object.keys(entity || {}).length < 1) {
    return {};
  }

  return {
    [field]: {
      ...entity,
      assignedTo: getByPathWithDefault([], 'assignedTo', entity).filter(
        user => getByPath('group.id', user) !== getByPath('id', partner)
      ),
      approvedAt:
        getByPath('approvedBy.group.id', entity) === getByPath('id', partner)
          ? null
          : getByPath('approvedAt', entity),
      approvedBy:
        getByPath('approvedBy.group.id', entity) === getByPath('id', partner)
          ? null
          : getByPath('approvedBy', entity),
    },
  };
};

export default class ShipmentTimelineContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldDeepValue = (path: string, value: any) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      set(cloneState, path, value);
      return cloneState;
    });

    if (path.toLowerCase().includes('date')) {
      setTimeout(() => {
        emitter.emit('AUTO_DATE');
      }, 200);
    }
  };

  cleanDataAfterChangeTransport = () => {
    this.setState(prevState => ({
      voyages: prevState.voyages
        ? prevState.voyages.map(item => ({
            ...item,
            arrivalPort: {
              seaport: '',
              airport: '',
            },
            departurePort: {
              seaport: '',
              airport: '',
            },
          }))
        : [{}],
    }));
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      if (path.toLowerCase().includes('date')) {
        setTimeout(() => {
          emitter.emit('AUTO_DATE');
        }, 200);
      }
      return removeNulls(cloneState);
    });
  };

  initDetailValues = (values: any) => {
    const parsedValues = { ...initValues, ...values };

    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

  onChangePartner = (partner: Object) => {
    const { cargoReady, containerGroups, voyages } = this.state;
    this.setState({
      ...(Object.keys(cargoReady).length > 0
        ? removeOldImporterStaff({
            entity: cargoReady,
            field: 'cargoReady',
            partner,
          })
        : { cargoReady }),
      containerGroups: containerGroups.map(group =>
        Object.keys(group).length > 0
          ? {
              ...group,
              ...removeOldImporterStaff({
                entity: getByPath('customClearance', group),
                field: 'customClearance',
                partner,
              }),
              ...removeOldImporterStaff({
                entity: getByPath('deliveryReady', group),
                field: 'deliveryReady',
                partner,
              }),
              ...removeOldImporterStaff({
                entity: getByPath('warehouseArrival', group),
                field: 'warehouseArrival',
                partner,
              }),
            }
          : group
      ),
      voyages: voyages.map(voyage =>
        Object.keys(voyage).length > 0
          ? {
              ...voyage,
              ...removeOldImporterStaff({
                entity: getByPath('arrival', voyage),
                field: 'arrival',
                partner,
              }),
              ...removeOldImporterStaff({
                entity: getByPath('departure', voyage),
                field: 'departure',
                partner,
              }),
            }
          : voyage
      ),
    });
  };
}
