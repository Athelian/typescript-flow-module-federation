// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Display, Blackout, Label } from 'components/Form';
import QuantityGraph from 'modules/relationMapV2/components/QuantityGraph';
import {
  ItemHeadingWrapperStyle,
  LeftWrapperStyle,
  TotalWrapperStyle,
  SelectAllButtonStyle,
  RightWrapperStyle,
  QuantityIconsWrapperStyle,
  QuantityLabelStyle,
  ExpandedIconWrapperStyle,
  ItemHeadingFilteredStyle,
  ItemHeadingSelectedStyle,
} from './style';

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
  const allowToSelectOrUnselectAll = true;
  const canViewTotal = true;
  const canViewQuantityGraph = true;

  // TODO: Replace with real numbers
  const selectedItemsCount = 0;

  return (
    <div className={ItemHeadingWrapperStyle(isExpanded)} onClick={onClick} role="presentation">
      <div className={LeftWrapperStyle}>
        <div className={TotalWrapperStyle}>
          <Label width="55px">
            <FormattedMessage id="components.button.total" defaultMessage="TOTAL" />
          </Label>
          <Display width="70px" blackout={!canViewTotal}>
            <FormattedNumber value={total} />
          </Display>
        </div>

        {allowToSelectOrUnselectAll && (
          <button
            onClick={event => {
              event.stopPropagation();
              onSelectAll();
            }}
            className={SelectAllButtonStyle}
            type="button"
          >
            <Label>
              {selectedItemsCount === total ? (
                <FormattedMessage
                  id="components.button.unselectAll"
                  defaultMessage="UNSELECT ALL"
                />
              ) : (
                <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
              )}
            </Label>
            <Icon icon="CHECKED" />
          </button>
        )}
      </div>

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

      <div className={ExpandedIconWrapperStyle(isExpanded)}>
        <Icon icon="CHEVRON_DOWN" />
      </div>

      <span className={ExpandedIconWrapperStyle(isExpanded)}>
        <Icon icon="CHEVRON_DOWN" />
      </span>

      <div className={ItemHeadingFilteredStyle(!isExpanded && hasFilterHits)} />

      <div className={ItemHeadingSelectedStyle(!isExpanded && hasSelectedChildren)} />
    </div>
  );
}
