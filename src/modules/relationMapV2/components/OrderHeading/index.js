// @flow
import * as React from 'react';
import { FocusedView } from 'modules/relationMapV2/store';
import { ORDER, ORDER_WIDTH } from 'modules/relationMapV2/constants';
import Heading from 'modules/relationMapV2/components/Heading';
import { targetedIds } from 'modules/relationMapV2/helpers';

type Props = {|
  orders: Array<Object>,
  hasSelectedChildren: boolean,
  hasFilterHits: boolean,
  isExpanded: boolean,
  onClick: Function,
  total: number,
  onSelectAll: Function,
|};

export default function OrderHeading({
  orders,
  hasSelectedChildren,
  hasFilterHits,
  isExpanded,
  onClick,
  total,
  onSelectAll,
}: Props) {
  // TODO: Replace with real permissions
  const { state } = FocusedView.useContainer();
  const orderIds = targetedIds(state.targets, ORDER);
  const selectedItemsCount = orders.filter(item => orderIds.includes(item.id)).length;
  return (
    <Heading
      width={`${ORDER_WIDTH}px`}
      hasSelectedChildren={hasSelectedChildren}
      hasFilterHits={hasFilterHits}
      isExpanded={isExpanded}
      onClick={onClick}
      total={total}
      selectedItemsCount={selectedItemsCount}
      onSelectAll={onSelectAll}
      renderRightSide={() => null}
    />
  );
}
