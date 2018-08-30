// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import Display from 'components/Display';

import {
  IconStyle,
  BarStyle,
  ProgressBarStyle,
  NumberLineStyle,
  CenterTopNumberStyle,
  CenterBottomNumberStyle,
  BatchedBadgeStyle,
  ShippedBadgeStyle,
} from './style';
import Number from './Number';
import Badge from './Badge';
import messages from './messages';

type Props = {
  orderedQuantity: number,
  batchedQuantity: number,
  shippedQuantity: number,
  hasLabel: boolean,
  batched: number,
  shipped: number,
};

export default function QuantityChart({
  orderedQuantity,
  batchedQuantity,
  shippedQuantity,
  hasLabel,
  batched,
  shipped,
}: Props) {
  const batchedQTYTitle = <FormattedMessage {...messages.batchedQuantity} />;
  const shippedQTYTitle = <FormattedMessage {...messages.shippedQuantity} />;

  return (
    <div>
      <div>
        {hasLabel ? (
          <Display ellipsis title={batchedQTYTitle}>
            <Number color="BATCH" value={batchedQuantity} />
            <Number color="GRAY" value={orderedQuantity - batchedQuantity} />
          </Display>
        ) : (
          <div className={NumberLineStyle}>
            <span className={CenterTopNumberStyle}>
              <Number color="BATCH" value={batchedQuantity} />
              <Number color="GRAY" value={orderedQuantity - batchedQuantity} />
            </span>
          </div>
        )}

        <div className={BarStyle}>
          <div
            className={ProgressBarStyle(
              'BATCH',
              orderedQuantity === 0 ? 0 : batchedQuantity / orderedQuantity
            )}
          >
            <div className={IconStyle('BATCH')}>
              <Icon icon="BATCH" />
            </div>

            {batched && (
              <div className={BatchedBadgeStyle}>
                <Badge value={batched} color="BATCH" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className={BarStyle}>
          <div
            className={ProgressBarStyle(
              'SHIPMENT',
              orderedQuantity === 0 ? 0 : shippedQuantity / orderedQuantity
            )}
          >
            <div className={IconStyle('SHIPMENT')}>
              <Icon icon="SHIPMENT" />
            </div>

            {shipped && (
              <div className={ShippedBadgeStyle}>
                <Badge value={shipped} color="SHIPMENT" />
              </div>
            )}
          </div>
          {hasLabel ? (
            <Display ellipsis title={shippedQTYTitle}>
              <Number color="SHIPMENT" value={shippedQuantity} />
              <Number color="GRAY" value={orderedQuantity - shippedQuantity} />
            </Display>
          ) : (
            <div className={NumberLineStyle}>
              <span className={CenterBottomNumberStyle}>
                <Number color="SHIPMENT" value={shippedQuantity} />
                <Number color="GRAY" value={orderedQuantity - shippedQuantity} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
