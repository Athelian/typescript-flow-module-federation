// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faExporter from '@fortawesome/fontawesome-pro-solid/faIndustryAlt';
import faOrdered from '@fortawesome/fontawesome-pro-solid/faFileEdit';
import faBatched from '@fortawesome/fontawesome-pro-solid/faBox';
import faShipped from '@fortawesome/fontawesome-pro-solid/faShip';
import { type Order } from 'modules/order/type.js.flow';
import messages from 'modules/order/messages';
import EntityCard, { EntityAction } from 'components/EntityCard';
import Dialog from 'components/Dialog';
import logger from 'utils/logger';
import {
  OrderItemStyle,
  DetailContainerStyle,
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
  WrapperCardStyle,
} from './style';
import RingChart from '../RingChart';
import OrderItemDetail from '../OrderItemDetail';

type Props = {
  order: ?Order,
  intl: intlShape,
  width?: number,
};

const OrderItem = ({ order, intl, width }: Props) => {
  if (!order) return '';

  const { PO, date, exporter, items } = order;

  const totalQuantity = items.reduce((total, item) => total + item.quantity || 0, 0);

  const totalUnshippedQuantity = totalQuantity - order.shippedQuantity;

  const wrapperClassName = width ? WrapperCardStyle(width) : '';

  const actions = [
    <EntityAction icon="fasClone" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="fasArchive" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="fasTrash" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard
      icon="farOrder"
      color="ORANGE_DARK"
      actions={actions}
      wrapperClassName={wrapperClassName}
    >
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
          <BooleanValue>
            {({ value: isOpen, toggle }) => (
              <React.Fragment>
                <Dialog
                  isOpen={isOpen}
                  onRequestClose={toggle}
                  options={{ width: Math.min(180 * items.length, window.innerWidth - 100) }}
                >
                  <div className={DetailContainerStyle}>
                    {items.map(item => (
                      <OrderItemDetail orderItem={item} key={item.id} />
                    ))}
                  </div>
                </Dialog>
                <button
                  type="button"
                  className={ChartButtonStyle}
                  onClick={() => items.length && toggle()}
                >
                  <RingChart
                    totalValue={totalQuantity}
                    values={[
                      { value: order.batchedQuantity, color: 'BLUE' },
                      { value: order.shippedQuantity, color: 'TEAL' },
                    ]}
                    cascadeTotalValue
                    showRedMargin
                  />
                </button>
              </React.Fragment>
            )}
          </BooleanValue>
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
    </EntityCard>
  );
};

OrderItem.defaultProps = {
  width: 0,
};

export default injectIntl(OrderItem);
