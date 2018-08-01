// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faExporter from '@fortawesome/fontawesome-pro-solid/faIndustryAlt';
import faOrdered from '@fortawesome/fontawesome-pro-solid/faFileEdit';
import faBatched from '@fortawesome/fontawesome-pro-solid/faBox';
import faShipped from '@fortawesome/fontawesome-pro-solid/faShip';
import { type Order } from 'modules/order/type.js.flow';
import messages from 'modules/order/messages';
import {
  OrderItemStyle,
  POStyle,
  PODateStyle,
  ExporterStyle,
  IconStyle,
  QuantitiesWrapper,
  QuantityStyle,
  UnshippedQuantityStyle,
  SlashStyle,
  ChartButtonStyle,
  FooterStyle,
} from './style';

type Props = {
  order: ?Order,
  intl: intlShape,
};

const OrderItem = ({ order, intl }: Props) => {
  if (!order) return null;

  const { PO, date, exporter, items } = order;

  const totalQuantity = items.reduce((total, item) => total + item.quantity || 0, 0);

  const totalUnshippedQuantity = totalQuantity - order.shippedQuantity;

  return (
    <div>
      <div className={OrderItemStyle}>
        <div className={POStyle} title={intl.formatMessage(messages.tooltipPO, { PO })}>
          {PO}
        </div>
        <div
          className={ExporterStyle}
          title={intl.formatMessage(messages.tooltipExporter, {
            exporter: exporter.name,
          })}
        >
          <FontAwesomeIcon icon={faExporter} className={IconStyle} fixedWidth />
          {exporter.name}
        </div>
        <div className={PODateStyle} title={intl.formatMessage(messages.tooltipPODate, { date })}>
          {date}
        </div>
        <div className={FooterStyle}>
          <button
            type="button"
            className={ChartButtonStyle}
            title={intl.formatMessage(messages.tooltipOpenChart)}
          >
            {totalQuantity}
          </button>
          <div className={QuantitiesWrapper}>
            <div
              className={QuantityStyle('GRAY_DARK')}
              title={intl.formatMessage(messages.tooltipOrderedQuantity, { totalQuantity })}
            >
              <FontAwesomeIcon icon={faOrdered} fixedWidth />
              {totalQuantity}
            </div>
            <div
              className={QuantityStyle('BLUE')}
              title={intl.formatMessage(messages.tooltipBatchedQuantity, {
                totalBatchedQuantity: order.batchedQuantity,
              })}
            >
              <FontAwesomeIcon icon={faBatched} fixedWidth />
              {order.batchedQuantity} order.shippedQuantity
            </div>
            <div
              className={QuantityStyle('TEAL')}
              title={intl.formatMessage(messages.tooltipShippedQuantity, {
                totalShippedQuantity: order.shippedQuantity,
              })}
            >
              <FontAwesomeIcon icon={faShipped} fixedWidth />
              {order.shippedQuantity}
            </div>
            <div
              className={UnshippedQuantityStyle}
              title={intl.formatMessage(messages.tooltipUnshippedQuantity, {
                totalUnshippedQuantity,
              })}
            >
              <FontAwesomeIcon icon={faShipped} fixedWidth />
              <div className={SlashStyle} />
              {totalUnshippedQuantity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(OrderItem);
