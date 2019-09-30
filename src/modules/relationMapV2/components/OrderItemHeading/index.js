// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Blackout, Label } from 'components/Form';
import { ORDER_ITEM_WIDTH } from 'modules/relationMapV2/constants';
import QuantityGraph from 'modules/relationMapV2/components/QuantityGraph';
import Heading from 'modules/relationMapV2/components/Heading';
import { RightWrapperStyle, QuantityIconsWrapperStyle, QuantityLabelStyle } from './style';

type Props = {|
  orderItems: Array<Object>,
  hasSelectedChildren: boolean,
  hasFilterHits: boolean,
  isExpanded: boolean,
  onClick: Function,
  total: number,
  onSelectAll: Function,
|};

export default function OrderItemHeading({
  orderItems,
  hasSelectedChildren,
  hasFilterHits,
  isExpanded,
  onClick,
  total,
  onSelectAll,
}: Props) {
  // TODO: Replace with real permissions
  const canViewQuantityGraph = true;

  return (
    <Heading
      width={`${ORDER_ITEM_WIDTH}px`}
      hasSelectedChildren={hasSelectedChildren}
      hasFilterHits={hasFilterHits}
      isExpanded={isExpanded}
      onClick={onClick}
      total={total}
      onSelectAll={onSelectAll}
      renderRightSide={() => (
        <div className={RightWrapperStyle}>
          <div className={QuantityIconsWrapperStyle}>
            <Icon icon="SHIPMENT" />
            <Icon icon="BATCH" />
            <Icon icon="ORDER_ITEM" />
          </div>

          {canViewQuantityGraph ? <QuantityGraph orderItems={orderItems} /> : <Blackout />}

          <div className={QuantityLabelStyle}>
            <Label>
              <FormattedMessage id="components.cards.qty" />
            </Label>
          </div>
        </div>
      )}
    />
  );
}
