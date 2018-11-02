// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { BooleanValue } from 'react-values';
import messages from 'modules/relationMap/messages';
import Badge from './Badge';

type SummaryBadgeProps = {
  intl: IntlShape,
  summary: Object,
  selectAll?: Function,
  unSelectAll?: Function,
};

const SummaryBadge = ({ summary, intl, selectAll, unSelectAll }: SummaryBadgeProps) => (
  <>
    <BooleanValue>
      {({ value, toggle }) => (
        <Badge
          icon="ORDER"
          color={value ? 'ORDER_DARK' : 'ORDER'}
          label={intl.formatMessage(messages.ordersLabel)}
          no={summary.sumOrders}
          onClick={() => {
            toggle();
            if (!value && selectAll) {
              selectAll('order');
            }
            if (value && unSelectAll) {
              unSelectAll('order');
            }
          }}
        />
      )}
    </BooleanValue>
    <BooleanValue>
      {({ value, toggle }) => (
        <Badge
          icon="ORDER_ITEM"
          color={value ? 'ORDER_ITEM_DARK' : 'ORDER_ITEM'}
          label={intl.formatMessage(messages.itemsLabel)}
          no={summary.sumOrderItems}
          onClick={() => {
            toggle();
            if (!value && selectAll) {
              selectAll('orderItem');
            }
            if (value && unSelectAll) {
              unSelectAll('orderItem');
            }
          }}
        />
      )}
    </BooleanValue>
    <BooleanValue>
      {({ value, toggle }) => (
        <Badge
          icon="BATCH"
          color={value ? 'BATCH_DARK' : 'BATCH'}
          label={intl.formatMessage(messages.batchesLabel)}
          no={summary.sumBatches}
          onClick={() => {
            toggle();
            if (!value && selectAll) {
              selectAll('batch');
            }
            if (value && unSelectAll) {
              unSelectAll('batch');
            }
          }}
        />
      )}
    </BooleanValue>
    <BooleanValue>
      {({ value, toggle }) => (
        <Badge
          icon="SHIPMENT"
          color={value ? 'SHIPMENT_DARK' : 'SHIPMENT'}
          label={intl.formatMessage(messages.shipmentsLabel)}
          no={summary.sumShipments}
          onClick={() => {
            toggle();
            if (!value && selectAll) {
              selectAll('shipment');
            }
            if (value && unSelectAll) {
              unSelectAll('shipment');
            }
          }}
        />
      )}
    </BooleanValue>
  </>
);
export default injectIntl(SummaryBadge);
