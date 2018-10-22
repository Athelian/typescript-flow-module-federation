// @flow
import * as React from 'react';
import { cloneOrder, cloneOrderItem, cloneBatch, cloneShipment } from './clone';

type State = {
  result: Object,
};

type Props = {
  children: Function,
};

class ActionContainer extends React.Component<Props, State> {
  state = {
    result: {},
  };

  setResult = (result: Object) => {
    this.setState({
      result,
    });
  };

  cloneTree = async () => {};

  clone = async (client: any, target: Object) => {
    const { batch, order, orderItem, shipment } = target;
    const [orderResults, orderFocus] = await cloneOrder(client, order);
    const [shipmentResults, shipmentFocus] = await cloneShipment(client, shipment);
    const [orderItemResult, orderItemFocus] = await cloneOrderItem(client, orderItem);
    const [batchResult, batchFocus] = await cloneBatch(client, batch);

    const result = {
      order: orderResults,
      orderItem: orderItemResult,
      batch: batchResult,
      shipment: shipmentResults,
    };
    const focus = {
      order: orderFocus,
      orderItem: orderItemFocus,
      batch: batchFocus,
      shipment: shipmentFocus,
    };
    return [result, focus];
  };

  render() {
    const { result } = this.state;
    const { children } = this.props;
    return children({
      result,
      setResult: this.setResult,
      clone: this.clone,
    });
  }
}

export default ActionContainer;
