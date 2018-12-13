// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { isEmpty } from 'utils/fp';
import RelationMapContainer from 'modules/relationMap/container';

const { useEffect } = React;

type ActionEffectProps = {
  children: React.Node,
  data: Object,
};

type EffectProps = {
  children: React.Node,
  data: Object,
  updateTargetData: Function,
  haveTarget: boolean,
};
const Effect = ({ children, data, updateTargetData, haveTarget }: EffectProps) => {
  useEffect(
    () => {
      if (haveTarget) {
        updateTargetData(data);
      }
    },
    [data]
  );
  return children;
};

const ActionEffect = ({ data, children }: ActionEffectProps) => (
  <Subscribe to={[RelationMapContainer]}>
    {({
      state: {
        targetedItem: { order = {}, orderItem = {}, batch = {}, shipment = {} },
      },
      updateTargetData,
    }) => (
      <Effect
        data={data}
        updateTargetData={updateTargetData}
        haveTarget={!isEmpty(order) || !isEmpty(orderItem) || !isEmpty(batch) || !isEmpty(shipment)}
      >
        {children}
      </Effect>
    )}
  </Subscribe>
);

export default ActionEffect;
