// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import {
  QuantityChartWrapperStyle,
  BarWrapperStyle,
  ProgressBarStyle,
  IconStyle,
  BadgeStyle,
  FloatingQuantityWrapperStyle,
} from './style';

type Props = {
  orderedQuantity: number,
  batchedQuantity: number,
  shippedQuantity: number,
  batched: number,
  shipped: number,
};

const QuantityChartMini = ({
  orderedQuantity,
  batchedQuantity,
  shippedQuantity,
  batched,
  shipped,
}: Props) => {
  let batchProgress = 0;
  let shippedProgress = 0;
  if (orderedQuantity <= 0) {
    batchProgress = 1;
    shippedProgress = 1;
  } else {
    batchProgress = batchedQuantity / orderedQuantity;
    shippedProgress = shippedQuantity / orderedQuantity;
  }

  return (
    <div className={QuantityChartWrapperStyle}>
      <div className={BarWrapperStyle}>
        <div className={ProgressBarStyle('BATCH', batchProgress)} />
        <div className={IconStyle}>
          <Icon icon="BATCH" />
        </div>
        <div className={BadgeStyle('top')}>
          <FormattedNumber value={batched} />
        </div>
      </div>

      <div className={BarWrapperStyle}>
        <div className={ProgressBarStyle('SHIPMENT', shippedProgress)} />
        <div className={IconStyle}>
          <Icon icon="SHIPMENT" />
        </div>
        <div className={BadgeStyle('bottom')}>
          <FormattedNumber value={shipped} />
        </div>
      </div>

      <div className={FloatingQuantityWrapperStyle}>
        <Display fontSize="SMALL" height="15px">
          <FormattedNumber value={orderedQuantity} />
        </Display>
      </div>
    </div>
  );
};

export default QuantityChartMini;
