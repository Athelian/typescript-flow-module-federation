// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeTypename, removeNulls } from 'utils/data';

type FormState = {
  cargoReady?: Object,
  containerGroups: Array<Object>,
  voyages: Array<Object>,
};

const initValues = {
  cargoReady: {
    assignedTo: [],
    timelineDateRevisions: [],
  },
  containerGroups: [
    {
      customClearance: {
        assignedTo: [],
        timelineDateRevisions: [],
      },
      warehouseArrival: {
        assignedTo: [],
        timelineDateRevisions: [],
      },
      deliveryReady: {
        assignedTo: [],
        timelineDateRevisions: [],
      },
    },
  ],
  voyages: [
    {
      departure: {
        assignedTo: [],
        timelineDateRevisions: [],
      },
      arrival: {
        assignedTo: [],
        timelineDateRevisions: [],
      },
    },
  ],
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
      // $FlowFixMe: missing type define for map's ramda function
      return removeNulls(cloneState);
    });
  };

  initDetailValues = (values: any) => {
    const parsedValues = removeTypename(values);
    // $FlowFixMe: missing type define for map's ramda function
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
