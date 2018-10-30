// @flow
import * as React from 'react';
import { getCloneFunction } from './clone';
import { getSplitFunction, getSplitResult, getSplitFocus, getSplitType } from './split';
import { connectNewShipment, connectExistingShipment } from './connect'

type State = {
  result: Object,
  currentAction: string,
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
    currentAction: '',
  };

  setResult = (result: Object) => {
    this.setState({
      result,
    });
  };

  setAction = (currentAction: string) => {
    this.setState({
      currentAction,
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

  clone = async (client: any, target: Object, focusMode: string) => {
    const clone = getCloneFunction(focusMode)
    const cloned = await clone(client, target)
    return cloned
  };

  connectNewShipment = async (client, target) => {
    const newTarget = await connectNewShipment(client, target)
    return newTarget
  }

  connectExistingShipment = async (client, target) => {
    const newTarget = await connectExistingShipment(client, target)
    return newTarget
  }

  render() {
    const { result, currentAction } = this.state;
    const { children } = this.props;
    return children({
      result,
      currentAction,
      setResult: this.setResult,
      setAction: this.setAction,
      split: this.split,
      clone: this.clone,
      connectNewShipment: this.connectNewShipment,
      connectExistingShipment: this.connectExistingShipment
    });
  }
}

export default ActionContainer;
