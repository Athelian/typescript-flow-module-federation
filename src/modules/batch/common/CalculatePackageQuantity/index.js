// @flow
import * as React from 'react';

const { useEffect } = React;

type Props = {
  batch: Object,
  children: React.Node,
  setPackageQuantity: Function,
};
const SubscribePackageQuantity = (props: Props) => {
  const { batch, children, setPackageQuantity } = props;
  const { batchAdjustments, packageCapacity, quantity } = batch;
  useEffect(
    () => {
      if (batch.autoCalculatePackageQuantity) {
        setPackageQuantity();
      }
    },
    [batchAdjustments, packageCapacity, quantity]
  );
  return children;
};

export default SubscribePackageQuantity;
