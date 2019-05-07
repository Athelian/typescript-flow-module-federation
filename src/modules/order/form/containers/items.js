// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';

type FormState = {
  orderItems: Array<Object>,
};

const initValues = {
  orderItems: [],
};

export default class OrderItemsContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  setFieldArrayValue = (index: number, value: any) => {
    this.setState(prevState =>
      update(prevState, {
        orderItems: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  initDetailValues = (orderItems: Array<Object>) => {
    this.setState({ orderItems });
    this.originalValues = { orderItems };
  };
}
