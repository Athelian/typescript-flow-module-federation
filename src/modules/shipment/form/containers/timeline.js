// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type ActionDetail = {
  approvedAt: ?Date,
  approvedBy: ?Object,
  assignedTo: Array<Object>,
  date: ?Date,
  timelineDateRevisions: Array<Object>,
};

type FormState = {
  cargoReady?: ActionDetail,
  containerGroups: ?Array<{
    customClearance?: ActionDetail,
    deliveryReady?: ActionDetail,
    warehouseArrival?: ActionDetail,
  }>,
  voyages: ?Array<{
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

const initValues = {
  containerGroups: [{}],
  voyages: [{}],
};

export default class ShipmentTimelineContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
  };

  setFieldDeepValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return cloneState;
    });
  };

  initDetailValues = (values: any) => {
    const parsedValues = removeTypename(values);
    // $FlowFixMe: missing type define for map's ramda function
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
