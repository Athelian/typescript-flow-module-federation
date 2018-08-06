// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import FallbackImage from 'media/logo_fallback.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faSupplier from '@fortawesome/fontawesome-pro-regular/faIndustry';
import faOrdered from '@fortawesome/fontawesome-pro-solid/faFileEdit';
import faBatched from '@fortawesome/fontawesome-pro-solid/faBox';
import faShipped from '@fortawesome/fontawesome-pro-solid/faShip';
import type { OrderItem } from 'modules/order/type.js.flow';
import messages from 'modules/order/messages';
import {
  OrderItemWrapperStyle,
  OrderItemStyle,
  ProductNameStyle,
  ProductSerialStyle,
  SupplierStyle,
  IconStyle,
  FooterStyle,
  QuantitiesWrapper,
  QuantityStyle,
  UnshippedQuantityStyle,
  SlashStyle,
  ChartButtonStyle,
  ImageStyle,
  ProductItemStyle,
} from './style';
import RingChart from '../RingChart';

type Props = {
  orderItem: OrderItem,
  intl: intlShape,
};

const OrderItemItem = ({ orderItem, intl }: Props) => {
  const { quantity, productExporterSupplier } = orderItem;
  const { supplier, product } = productExporterSupplier;

  const totalQuantity = quantity || 0;
  const totalUnshippedQuantity = totalQuantity - orderItem.shippedQuantity;

  const image =
    product.files.length > 0
      ? `${process.env.ZENPORT_FS_URL || ''}/${product.files[0].path}`
      : FallbackImage;

  return (
    <div className={OrderItemWrapperStyle}>
      <div className={OrderItemStyle}>
        <div className={ProductItemStyle}>
          <div>
            <img src={image} alt={product.name} className={ImageStyle} />
          </div>
          <div>
            <div
              className={ProductNameStyle}
              title={intl.formatMessage(messages.tooltipProduct, { product: product.name })}
            >
              {product.name}
            </div>
            <div
              className={ProductSerialStyle}
              title={intl.formatMessage(messages.tooltipSerial, { serial: product.serial })}
            >
              {product.serial}
            </div>
            <div
              className={SupplierStyle}
              title={intl.formatMessage(messages.tooltipSupplier, {
                supplier: supplier ? supplier.name : 'N/A',
              })}
            >
              <FontAwesomeIcon icon={faSupplier} className={IconStyle} fixedWidth />
              {supplier && supplier.name}
            </div>
          </div>
        </div>
        <div className={FooterStyle}>
          <div className={ChartButtonStyle}>
            <RingChart
              totalValue={totalQuantity}
              values={[
                { value: orderItem.batchedQuantity, color: 'BLUE' },
                { value: orderItem.shippedQuantity, color: 'TEAL' },
              ]}
              cascadeTotalValue
              showRedMargin
            />
          </div>
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
                totalBatchedQuantity: orderItem.batchedQuantity,
              })}
            >
              <FontAwesomeIcon icon={faBatched} fixedWidth />
              {orderItem.batchedQuantity}
            </div>
            <div
              className={QuantityStyle('TEAL')}
              title={intl.formatMessage(messages.tooltipShippedQuantity, {
                totalShippedQuantity: orderItem.shippedQuantity,
              })}
            >
              <FontAwesomeIcon icon={faShipped} fixedWidth />
              {orderItem.shippedQuantity}
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

export default injectIntl(OrderItemItem);
