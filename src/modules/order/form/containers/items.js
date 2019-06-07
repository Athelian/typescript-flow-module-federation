// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';

type FormState = {
  orderItems: Array<Object>,
  hasCalledItemsApiYet: boolean,
};

const initValues: FormState = {
  orderItems: [],
  hasCalledItemsApiYet: false,
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

  initDetailValues = (orderItems: Array<Object>, hasCalledItemsApiYet: boolean = false) => {
    this.setState({ orderItems, hasCalledItemsApiYet });
    if (hasCalledItemsApiYet) {
      this.originalValues = { orderItems, hasCalledItemsApiYet };
    }
  };

  changeExporter = () => {
    let retry;
    if (this.state.hasCalledItemsApiYet) {
      this.setState({
        orderItems: [],
      });
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledItemsApiYet) {
          this.setState({
            orderItems: [],
          });
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };

  resetAmountWithNewCurrency = (currency: string, isReset: boolean = true) => {
    let retry;
    if (this.state.hasCalledItemsApiYet) {
      const { orderItems } = this.state;
      this.setState({
        orderItems: orderItems.map(orderItem => ({
          ...orderItem,
          price: {
            ...orderItem.price,
            ...(isReset ? { amount: 0 } : {}),
            currency,
          },
        })),
      });
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledItemsApiYet) {
          const { orderItems } = this.state;
          this.setState({
            orderItems: orderItems.map(orderItem => ({
              ...orderItem,
              price: {
                ...orderItem.price,
                ...(isReset ? { amount: 0 } : {}),
                currency,
              },
            })),
          });
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };
}
