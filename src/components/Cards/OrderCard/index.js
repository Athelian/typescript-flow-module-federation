// @flow
import React from 'react';
import { navigate } from '@reach/router';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { Label, Display, FieldItem } from 'components/Form';
import BaseCard, { CardAction } from '../BaseCard';
import {
  OrderCardWrapperStyle,
  OrderInfoWrapperStyle,
  POWrapperStyle,
  ExporterWrapperStyle,
  DividerStyle,
  ChartWrapperStyle,
  TagsWrapperStyle,
} from './style';

type Props = {
  order: ?Object,
};

const OrderCard = ({ order }: Props) => {
  if (!order) return '';

  const { id, poNo, orderItems, currency, exporter } = order;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  const totalItems = orderItems.length;

  let totalPrice = 0;
  orderItems.forEach(item => {
    totalPrice += item.price ? item.price.amount : 0;
  });

  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let numOfBatched = 0;
  let numOfShipped = 0;

  orderItems.forEach(item => {
    orderedQuantity += item.quantity || 0;
    if (item.batches) {
      item.batches.forEach(batch => {
        batchedQuantity += batch.quantity;
        numOfBatched += 1;
        if (batch.batchAdjustments) {
          batch.batchAdjustments.forEach(batchAdjustment => {
            batchedQuantity += batchAdjustment.quantity;
          });
        }
        if (batch.shipment) {
          shippedQuantity += batch.quantity;
          numOfShipped += 1;
        }
      });
    }
  });

  return (
    <BaseCard icon="ORDER" color="ORDER" actions={actions}>
      <div
        className={OrderCardWrapperStyle}
        onClick={() => navigate(`/order/${encodeId(id)}`)}
        role="presentation"
      >
        <div className={OrderInfoWrapperStyle}>
          <div className={POWrapperStyle}>
            <Display align="left">{poNo}</Display>
          </div>
          <div className={ExporterWrapperStyle}>
            <Icon icon="EXPORTER" />
            {exporter.name}
          </div>
          <FieldItem
            label={<Label>TTL PRICE</Label>}
            input={
              <Display>
                <FormattedNumber value={totalPrice} suffix={currency} />
              </Display>
            }
          />
          <FieldItem
            label={<Label>TTL ITEMS</Label>}
            input={
              <Display>
                <FormattedNumber value={totalItems} />
              </Display>
            }
          />
          <div className={DividerStyle} />
          <div className={ChartWrapperStyle}>
            <QuantityChart
              hasLabel={false}
              orderedQuantity={orderedQuantity}
              batchedQuantity={batchedQuantity}
              shippedQuantity={shippedQuantity}
              batched={numOfBatched}
              shipped={numOfShipped}
            />
          </div>
          <div className={TagsWrapperStyle}>
            {order.tags.length > 0 && order.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default OrderCard;
