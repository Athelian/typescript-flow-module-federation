// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import {
  QuantityChartWrapperStyle,
  FloatingQuantityWrapperStyle,
  BarWrapperStyle,
  IconStyle,
  ProgressBarStyle,
} from './style';

type Props = {
  orderedQuantity: number,
  batchedQuantity: number,
  shippedQuantity: number,
};

const QuantityChartMini = ({ orderedQuantity, batchedQuantity, shippedQuantity }: Props) => {
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
      </div>

      <div className={BarWrapperStyle}>
        <div className={ProgressBarStyle('SHIPMENT', shippedProgress)} />
        <div className={IconStyle}>
          <Icon icon="SHIPMENT" />
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
