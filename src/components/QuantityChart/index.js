// @flow

import * as React from 'react';
import Icon from 'components/Icon';

import Display from 'components/Display';
import { colors } from 'styles/common';
import {
  iconStyle,
  barStyle,
  progressBarStyle,
  centerTopNumberStyle,
  centerBottomNumberStyle,
  numberLineStyle,
  batchedBadgeStyle,
  shippedBadgeStyle,
} from 'components/QuantityChart/style';
import Number from 'components/QuantityChart/Number';
import Badge from 'components/QuantityChart/Badge';

type Props = {
  orderedQuantity: number,
  batchedQuantity: number,
  shippedQuantity: number,
  hasLabel: boolean,
  numBatched: number,
  numShipped: number,
};

export default function QuantityChart({
  orderedQuantity,
  batchedQuantity,
  shippedQuantity,
  hasLabel,
  numBatched,
  numShipped,
}: Props) {
  return (
    <div>
      <div>
        {hasLabel ? (
          <Display ellipsis title="BATCHED QTY">
            <Number color={colors.BATCH} value={batchedQuantity} />
            <Number color={colors.GRAY} value={orderedQuantity - batchedQuantity} />
          </Display>
        ) : (
          <div className={numberLineStyle()}>
            <span className={centerTopNumberStyle()}>
              <Number color={colors.BATCH} value={batchedQuantity} />
              <Number color={colors.GRAY} value={orderedQuantity - batchedQuantity} />
            </span>
          </div>
        )}

        <div className={barStyle()}>
          <div className={progressBarStyle(colors.BATCH, batchedQuantity / orderedQuantity)}>
            <div className={iconStyle()}>
              <Icon icon="BATCH" />
            </div>

            {numBatched && (
              <div className={batchedBadgeStyle()}>
                <Badge value={numBatched} color={colors.BATCH} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className={barStyle()}>
          <div className={progressBarStyle(colors.SHIPMENT, shippedQuantity / orderedQuantity)}>
            <div className={iconStyle()}>
              <Icon icon="SHIPMENT" />
            </div>

            {numBatched && (
              <div className={shippedBadgeStyle()}>
                <Badge value={numShipped} color={colors.SHIPMENT} />
              </div>
            )}
          </div>
          {hasLabel ? (
            <Display title="SHIPPED QTY">
              <Number color={colors.SHIPMENT} value={shippedQuantity} />
              <Number color={colors.GRAY} value={orderedQuantity - shippedQuantity} />
            </Display>
          ) : (
            <div className={numberLineStyle()}>
              <span className={centerBottomNumberStyle()}>
                <Number color={colors.SHIPMENT} value={shippedQuantity} />
                <Number color={colors.GRAY} value={orderedQuantity - shippedQuantity} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
