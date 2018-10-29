// @flow
import * as React from 'react';
import { cloneOrder, cloneOrderItem, cloneBatch, cloneShipment, cloneTree } from './clone';
import { getSplitFunction, getSplitResult, getSplitFocus, getSplitType } from './split';

type State = {
  result: Object,
  currentPanel: string,
};

type Props = {
  children: Function,
};

const getDefaultResult = () => ({
  order: [],
  shipment: [],
  orderItem: {},
  batch: {},
});

const getDefaultFocus = () => ({
  order: {},
  orderItem: {},
  shipment: {},
  batch: {},
});

class ActionContainer extends React.Component<Props, State> {
  state = {
    result: {},
    currentPanel: '',
  };

  setResult = (result: Object) => {
    this.setState({
      result,
    });
  };

  setPanel = (currentPanel: string) => {
    this.setState({
      currentPanel,
    });
  };

  split = async (client: any, target: Object, data: Object) => {
    const split = getSplitFunction(data.tabIndex);
    const splitType = getSplitType(data.tabIndex);
    const results = await split(client, target, data);
    return [
      {
        ...getDefaultResult(),
        batch: getSplitResult(results, splitType),
      },
      {
        ...getDefaultFocus(),
        batch: getSplitFocus(results, splitType),
      },
    ];
  };

  cloneTree = async (client: any, target: Object) => {
    const clonedTree = await cloneTree(client, target);
    return clonedTree;
  };

  clone = async (client: any, target: Object) => {
    const { batch, order, orderItem, shipment } = target;
    // TODO: should run in parallel
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

  getCloneFunction = (focusMode: string) => {
    switch (focusMode) {
      default:
      case 'TARGET':
        return this.clone;
      case 'TARGET_TREE':
        return this.cloneTree;
    }
  };

  render() {
    const { result, currentPanel } = this.state;
    const { children } = this.props;
    return children({
      result,
      currentPanel,
      setResult: this.setResult,
      setPanel: this.setPanel,
      split: this.split,
      clone: this.clone,
      cloneTree: this.cloneTree,
      getCloneFunction: this.getCloneFunction,
    });
  }
}

export default ActionContainer;
