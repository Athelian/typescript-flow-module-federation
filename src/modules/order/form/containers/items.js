// @flow
import type { OrderItemPayload, ShipmentPayload, ContainerPayload } from 'generated/graphql';
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { isEquals, getByPath, getByPathWithDefault } from 'utils/fp';

type FormState = {|
  orderItems: Array<OrderItemPayload>,
  hasCalledItemsApiYet: boolean,
|};

export const initValues: FormState = {
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
      this.changeCurrency(isReset, currency);
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledItemsApiYet) {
          this.changeCurrency(isReset, currency);
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };

  changeCurrency(isReset: boolean, currency: string) {
    const { orderItems } = this.state;
    this.setState({
      orderItems: orderItems.map(orderItem => ({
        ...orderItem,
        price: {
          ...getByPath('price', orderItem),
          ...(isReset ? { amount: 0 } : {}),
          currency,
        },
      })),
    });
  }

  getShipments = (): Array<ShipmentPayload> => {
    const shipments = [];
    const { orderItems } = this.state;
    orderItems.forEach(orderItem => {
      const batches = getByPathWithDefault([], 'batches', orderItem);
      batches.forEach(batch => {
        if (batch.shipment && !shipments.includes(batch.shipment)) {
          shipments.push(batch.shipment);
        }
      });
    });
    return shipments;
  };

  getContainers = (): Array<ContainerPayload> => {
    const containers = [];
    const { orderItems } = this.state;
    orderItems.forEach(orderItem => {
      const batches = getByPathWithDefault([], 'batches', orderItem);
      batches.forEach(batch => {
        if (batch.container && !containers.includes(batch.container)) {
          containers.push(batch.container);
        }
      });
    });
    return containers;
  };
}
