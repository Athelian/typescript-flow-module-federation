// @flow
import React from 'react';
import { navigate } from '@reach/router';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display, FieldItem } from 'components/Form';
import BaseCard, { CardAction } from '../BaseCard';
import {
  OrderCardWrapperStyle,
  OrderInfoWrapperStyle,
  QuantityWrapperStyle,
  UnitPriceWrapperStyle,
  DividerStyle,
  ChartWrapperStyle,
} from './style';

type Props = {
  order: ?Object,
};

function getQuantitySummary(items: Array<Object>) {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let numOfBatched = 0;
  let numOfShipped = 0;

  items.forEach(item => {
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

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    numOfBatched,
    numOfShipped,
  };
}

const OrderCard = ({ order }: Props) => {
  if (!order) return '';

  const { id, orderItems, currency } = order;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  const chartDetail = getQuantitySummary(orderItems);

  const totalItems = orderItems.length;

  let totalPrice = 0;
  orderItems.forEach(item => {
    totalPrice += item.price ? item.price.amount : 0;
  });

  return (
    <BaseCard icon="ORDER" color="ORDER" actions={actions}>
      <div
        className={OrderCardWrapperStyle}
        onClick={() => navigate(`/order/${encodeId(id)}`)}
        role="presentation"
      >
        <div className={OrderInfoWrapperStyle}>
          <div className={QuantityWrapperStyle}>
            <FieldItem
              label={<Label required>TTL ITEMS</Label>}
              input={
                <Display>
                  <FormattedNumber value={totalItems} />
                </Display>
              }
            />
          </div>

          <div className={UnitPriceWrapperStyle}>
            <FieldItem
              label={<Label required>TTL PRICE</Label>}
              input={
                <Display>
                  <FormattedNumber value={totalPrice} suffix={currency} />
                </Display>
              }
            />
          </div>
          <div className={DividerStyle} />
          <div className={ChartWrapperStyle}>
            <QuantityChart
              hasLabel={false}
              orderedQuantity={chartDetail.orderedQuantity}
              batchedQuantity={chartDetail.batchedQuantity}
              shippedQuantity={chartDetail.shippedQuantity}
              batched={chartDetail.numOfBatched}
              shipped={chartDetail.numOfShipped}
            />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default OrderCard;
