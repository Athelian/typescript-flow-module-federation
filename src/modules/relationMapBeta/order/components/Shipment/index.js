// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { ShipmentCollapsed, WrapperCard } from 'components/RelationMap';
import type { ShipmentProps } from 'modules/relationMapBeta/order/type.js.flow';
import { ItemWrapperStyle } from 'modules/relationMap/common/RelationItem/style';

type OptionalProps = {
  wrapperClassName: string,
  onToggle: Function,
};

type Props = OptionalProps & ShipmentProps;

const defaultProps = {
  wrapperClassName: ItemWrapperStyle(false),
};

export default function Shipment({ wrapperClassName, onToggle, ...shipment }: Props) {
  return (
    <BaseCard
      showActionsOnHover
      icon="SHIPMENT"
      color="SHIPMENT"
      wrapperClassName={wrapperClassName}
    >
      <WrapperCard onClick={onToggle}>
        <ShipmentCollapsed shipment={shipment} />
      </WrapperCard>
    </BaseCard>
  );
}

Shipment.defaultProps = defaultProps;
