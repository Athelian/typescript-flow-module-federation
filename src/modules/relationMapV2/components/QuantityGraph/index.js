// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import {
  QuantityGraphWrapperStyle,
  NumbersWrapperStyle,
  NumberStyle,
  GraphWrapperStyle,
  ProgressBarBackgroundStyle,
  ProgressBarStyle,
} from './style';

type Props = {|
  orderItems: Array<Object>,
|};

export default function QuantityGraph({ orderItems = [] }: Props) {
  let totalItemQuantity = 0;
  let totalBatchQuantity = 0;
  let totalShippedQuantity = 0;

  orderItems.forEach(orderItem => {
    const orderItemQuantity = orderItem?.quantity ?? 0;
    totalItemQuantity += orderItemQuantity;

    const batches = orderItem?.batches ?? [];
    batches.forEach(batch => {
      const batchQuantity = batch?.latestQuantity;
      totalBatchQuantity += batchQuantity;

      if (batch?.shipment?.id) {
        totalShippedQuantity += batchQuantity;
      }
    });
  });

  let batchProgress = 0;
  let shippedProgress = 0;
  if (totalItemQuantity <= 0) {
    batchProgress = 1;
    shippedProgress = 1;
  } else {
    batchProgress = totalBatchQuantity / totalItemQuantity;
    shippedProgress = totalShippedQuantity / totalItemQuantity;
  }

  return (
    <div className={QuantityGraphWrapperStyle}>
      <div className={NumbersWrapperStyle}>
        <div className={NumberStyle('SHIPMENT', 'left')}>
          <FormattedNumber value={totalShippedQuantity} />
        </div>

        <div className={NumberStyle('BATCH', 'center')}>
          <FormattedNumber value={totalBatchQuantity} />
        </div>

        <div className={NumberStyle('BLACK', 'right')}>
          <FormattedNumber value={totalItemQuantity} />
        </div>
      </div>

      <div className={GraphWrapperStyle}>
        <div className={ProgressBarBackgroundStyle}>
          <div className={ProgressBarStyle('BATCH', batchProgress)} />
          <div className={ProgressBarStyle('SHIPMENT', shippedProgress)} />
        </div>
      </div>
    </div>
  );
}
