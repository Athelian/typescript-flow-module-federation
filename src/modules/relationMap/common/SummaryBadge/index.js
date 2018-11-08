// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import messages from 'modules/relationMap/messages';
import Badge from './Badge';

type SummaryBadgeProps = {
  intl: IntlShape,
  summary: Object,
  targetedItem: Object,
  selectAll?: Function,
  unSelectAll?: Function,
};

const isSelected = (selected, totalItem) => {
  const totalSelected = Object.keys(selected || {}).length;
  return totalItem === totalSelected;
};
const SummaryBadge = ({
  summary,
  intl,
  selectAll,
  unSelectAll,
  targetedItem,
}: SummaryBadgeProps) => {
  const { order, orderItem, batch, shipment } = targetedItem;
  const { sumOrders, sumOrderItems, sumBatches, sumShipments } = summary;
  const orderSelected = isSelected(order, sumOrders);
  const orderItemSelected = isSelected(orderItem, sumOrderItems);
  const batchSelected = isSelected(batch, sumBatches);
  const shipmentSelected = isSelected(shipment, sumShipments);
  return (
    <>
      <Badge
        icon="ORDER"
        color={orderSelected ? 'ORDER_DARK' : 'ORDER'}
        hoverColor="ORDER_DARK"
        label={intl.formatMessage(messages.ordersLabel)}
        no={sumOrders}
        onClick={() => {
          if (!orderSelected && selectAll) {
            selectAll('order');
          }
          if (orderSelected && unSelectAll) {
            unSelectAll('order');
          }
        }}
      />
      <Badge
        icon="ORDER_ITEM"
        color={orderItemSelected ? 'ORDER_ITEM_DARK' : 'ORDER_ITEM'}
        hoverColor="ORDER_ITEM_DARK"
        label={intl.formatMessage(messages.itemsLabel)}
        no={sumOrderItems}
        onClick={() => {
          if (!orderItemSelected && selectAll) {
            selectAll('orderItem');
          }
          if (orderItemSelected && unSelectAll) {
            unSelectAll('orderItem');
          }
        }}
      />
      <Badge
        icon="BATCH"
        color={batchSelected ? 'BATCH_DARK' : 'BATCH'}
        hoverColor="BATCH_DARK"
        label={intl.formatMessage(messages.batchesLabel)}
        no={sumBatches}
        onClick={() => {
          if (!batchSelected && selectAll) {
            selectAll('batch');
          }
          if (batchSelected && unSelectAll) {
            unSelectAll('batch');
          }
        }}
      />
      <Badge
        icon="SHIPMENT"
        color={shipmentSelected ? 'SHIPMENT_DARK' : 'SHIPMENT'}
        hoverColor="SHIPMENT_DARK"
        label={intl.formatMessage(messages.shipmentsLabel)}
        no={sumShipments}
        onClick={() => {
          if (!shipmentSelected && selectAll) {
            selectAll('shipment');
          }
          if (shipmentSelected && unSelectAll) {
            unSelectAll('shipment');
          }
        }}
      />
    </>
  );
};
export default injectIntl(SummaryBadge);
