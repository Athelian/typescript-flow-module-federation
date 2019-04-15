// @flow
import { Container } from 'unstated';
import { cloneDeep, unset, set } from 'lodash';
import { isEquals } from 'utils/fp';
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
  cargoReady?: ActionDetail,
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

const initValues: FormState = {
  cargoReady: {},
  containerGroups: [{}],
  voyages: [{}],
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
}
