// @flow

import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import GridRow from 'components/GridRow';
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

const ProductFocusedChart = ({ orderedQuantity, batchedQuantity, shippedQuantity }: Props) => {
  let batchProgress = 0;
  if (orderedQuantity <= 0) {
    if (batchedQuantity > 0) {
      batchProgress = 1;
    } else {
      batchProgress = 0;
    }
  } else {
    batchProgress = batchedQuantity / orderedQuantity;
  }

  return (
    <div className={QuantityChartWrapperStyle}>
      <div className={BarWrapperStyle}>
        <div
          className={ProgressBarStyle(
            'SHIPMENT',
            orderedQuantity === 0 ? 0 : shippedQuantity / orderedQuantity
          )}
        />
        <div className={IconStyle}>
          <Icon icon="SHIPMENT" />
        </div>
      </div>

      <div className={BarWrapperStyle}>
        <div className={ProgressBarStyle('BATCH', batchProgress)} />
        <div className={IconStyle}>
          <Icon icon="BATCH" />
        </div>
      </div>

      <div className={FloatingQuantityWrapperStyle('top')}>
        <GridRow gap="0px">
          <Display color="BATCH" fontSize="SMALL">
            <FormattedNumber value={batchedQuantity} />
          </Display>
          <Display color="GRAY_LIGHT" fontSize="SMALL">
            <FormattedNumber value={orderedQuantity - batchedQuantity} />
          </Display>
        </GridRow>
      </div>

      <div className={FloatingQuantityWrapperStyle('bottom')}>
        <GridRow gap="0px">
          <Display color="SHIPMENT" fontSize="SMALL">
            <FormattedNumber value={shippedQuantity} />
          </Display>
          <Display color="GRAY_LIGHT" fontSize="SMALL">
            <FormattedNumber value={orderedQuantity - shippedQuantity} />
          </Display>
        </GridRow>
      </div>
    </div>
  );
};

export default ProductFocusedChart;
