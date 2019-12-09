// @flow
import type { OrderItemPayload, ShipmentPayload, ContainerPayload } from 'generated/graphql';
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { isEquals, getByPathWithDefault, getByPath } from 'utils/fp';

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

  isDirty = () => {
    // Should ignore the currency from items when compare the state
    // because on the order form, the currency is always force to order currency
    return !isEquals(
      {
        ...this.state,
        orderItems: this.state.orderItems.map(item => ({
          ...item,
          price: item.price?.amount ?? 0,
        })),
      },
      {
        ...this.originalValues,
        orderItems: this.originalValues.orderItems.map(item => ({
          ...item,
          price: item.price?.amount ?? 0,
        })),
      }
    );
  };

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

  resetAmountWithNewCurrency = (currency: string) => {
    let retry;
    if (this.state.hasCalledItemsApiYet) {
      this.changeCurrency(currency);
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledItemsApiYet) {
          this.changeCurrency(currency);
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };

  changeCurrency(currency: string) {
    const { orderItems } = this.state;
    this.setState({
      orderItems: orderItems.map(orderItem => ({
        ...orderItem,
        price: {
          amount: getByPath('price.amount', orderItem),
          currency,
        },
      })),
    });
  }

  getShipments = (): Array<ShipmentPayload> => {
    const shipments = [];
    const shipmentIds = [];
    const { orderItems } = this.state;
    orderItems.forEach(orderItem => {
      const batches = getByPathWithDefault([], 'batches', orderItem);
      batches.forEach(batch => {
        if (batch.shipment && !shipmentIds.includes(batch.shipment.id)) {
          shipmentIds.push(batch.shipment.id);
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
