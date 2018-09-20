// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import GridRow from 'components/GridRow';
import Icon from 'components/Icon';
import { Display, Label, FieldItem } from 'components/Form';
import {
  QuantityChartWrapperStyle,
  FloatingQuantityWrapperStyle,
  BarWrapperStyle,
  IconStyle,
  ProgressBarStyle,
  BadgeStyle,
} from './style';
import messages from './messages';

type OptionalProps = {
  hasLabel: boolean,
  batched: number,
  shipped: number,
};

type Props = OptionalProps & {
  orderedQuantity: number,
  batchedQuantity: number,
  shippedQuantity: number,
};

const defaultProps = {
  hasLabel: false,
  batched: 0,
  shipped: 0,
};

const QuantityChart = ({
  orderedQuantity,
  batchedQuantity,
  shippedQuantity,
  hasLabel,
  batched,
  shipped,
}: Props) => (
  <div className={QuantityChartWrapperStyle}>
    {hasLabel ? (
      <FieldItem
        label={
          <Label>
            <FormattedMessage {...messages.batchedQuantity} />
          </Label>
        }
        input={
          <GridRow gap="0px">
            <Display color="BATCH">
              <FormattedNumber value={batchedQuantity} />
            </Display>
            <Display color="GRAY_LIGHT">
              <FormattedNumber value={orderedQuantity - batchedQuantity} />
            </Display>
          </GridRow>
        }
      />
    ) : (
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
    )}

    <div className={BarWrapperStyle}>
      <div
        className={ProgressBarStyle(
          'BATCH',
          orderedQuantity === 0 ? 0 : batchedQuantity / orderedQuantity
        )}
      />
      <div className={IconStyle}>
        <Icon icon="BATCH" />
      </div>

      {!hasLabel && (
        <div className={BadgeStyle('bottom')}>
          <FormattedNumber value={batched} />
        </div>
      )}
    </div>

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

      {!hasLabel && (
        <div className={BadgeStyle('top')}>
          <FormattedNumber value={shipped} />
        </div>
      )}
    </div>

    {hasLabel ? (
      <FieldItem
        label={
          <Label>
            <FormattedMessage {...messages.shippedQuantity} />
          </Label>
        }
        input={
          <GridRow gap="0px">
            <Display color="SHIPMENT">
              <FormattedNumber value={shippedQuantity} />
            </Display>
            <Display color="GRAY_LIGHT">
              <FormattedNumber value={orderedQuantity - shippedQuantity} />
            </Display>
          </GridRow>
        }
      />
    ) : (
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
    )}
  </div>
);

QuantityChart.defaultProps = defaultProps;

export default QuantityChart;
