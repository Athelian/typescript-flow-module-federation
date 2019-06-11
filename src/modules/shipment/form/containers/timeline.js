// @flow
import { Container } from 'unstated';
import { cloneDeep, unset, set } from 'lodash';
import { isEquals, getByPath } from 'utils/fp';
import { removeNulls } from 'utils/data';
import emitter from 'utils/emitter';

type ActionDetail = {
  approvedAt?: ?Date,
  approvedBy?: ?Object,
  assignedTo?: Array<Object>,
  date?: ?Date,
  timelineDateRevisions?: Array<Object>,
};

type FormState = {
  cargoReady: ActionDetail,
  containerGroups: Array<{
    customClearance?: ActionDetail,
    deliveryReady?: ActionDetail,
    warehouseArrival?: ActionDetail,
  }>,
  voyages: Array<{
    arrival?: ActionDetail,
    arrivalPort?: {
      airport: string,
      seaport: string,
    },
    departure?: ActionDetail,
    departurePort?: {
      airport: string,
      seaport: string,
    },
    vesselCode?: string,
    vesselName?: string,
  }>,
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
  entity: Object,
  field: string,
  partner: Object,
}) => {
  if (Object.keys(entity || {}).length < 1) {
    return {};
  }

  return {
    [field]: {
      ...entity,
      assignedTo: entity.assignedTo.filter(user => getByPath('group.id', user) !== partner.id),
      approvedAt:
        getByPath('approvedBy.group.id', entity) === partner.id ? null : entity.approvedAt,
      approvedBy:
        getByPath('approvedBy.group.id', entity) === partner.id ? null : entity.approvedBy,
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
                entity: group.customClearance,
                field: 'customClearance',
                partner,
              }),
              ...removeOldImporterStaff({
                entity: group.deliveryReady,
                field: 'deliveryReady',
                partner,
              }),
              ...removeOldImporterStaff({
                entity: group.warehouseArrival,
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
                entity: voyage.arrival,
                field: 'arrival',
                partner,
              }),
              ...removeOldImporterStaff({
                entity: voyage.departure,
                field: 'departure',
                partner,
              }),
            }
          : voyage
      ),
    });
  };
}
