// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import messages from 'modules/relationMap/messages';
import Badge from './Badge';

type SummaryBadgeProps = {
  intl: IntlShape,
  summary: Object,
};

const SummaryBadge = ({ summary, intl }: SummaryBadgeProps) => (
  <>
    <Badge
      icon="ORDER"
      color="ORDER"
      label={intl.formatMessage(messages.ordersLabel)}
      no={summary.sumOrders}
    />
    <Badge
      icon="ORDER_ITEM"
      color="ORDER_ITEM"
      label={intl.formatMessage(messages.itemsLabel)}
      no={summary.sumOrderItems}
    />
    <Badge
      icon="BATCH"
      color="BATCH"
      label={intl.formatMessage(messages.batchesLabel)}
      no={summary.sumBatches}
    />
    <Badge
      icon="SHIPMENT"
      color="SHIPMENT"
      label={intl.formatMessage(messages.shipmentsLabel)}
      no={summary.sumShipments}
    />
  </>
);
export default injectIntl(SummaryBadge);
