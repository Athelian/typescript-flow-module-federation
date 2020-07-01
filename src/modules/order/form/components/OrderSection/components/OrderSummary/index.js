// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { type MetricValue } from 'generated/graphql';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import QuantityChart from 'components/QuantityChart';

type Props = {
  orderedQuantity: number,
  batchedQuantity: number,
  shippedQuantity: number,
  currency: string,
  totalPrice: number,
  totalItems: number,
  totalBatches: number,
  totalVolume: MetricValue,
};

export default function OrderSummary({
  orderedQuantity,
  batchedQuantity,
  shippedQuantity,
  currency,
  totalPrice,
  totalItems,
  totalBatches,
  totalVolume,
}: Props) {
  return (
    <>
      <GridColumn>
        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.Orders.orderedQTY" defaultMessage="ORDERED QTY" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={orderedQuantity} />
            </Display>
          }
        />

        <QuantityChart
          hasLabel
          orderedQuantity={orderedQuantity}
          batchedQuantity={batchedQuantity}
          shippedQuantity={shippedQuantity}
        />
      </GridColumn>
      <GridColumn>
        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.Orders.totalPrice" defaultMessage="TOTAL PRICE" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={totalPrice} /> {currency}
            </Display>
          }
        />
        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.Orders.totalItems" defaultMessage="TOTAL ITEMS" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={totalItems} />
            </Display>
          }
        />
        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.Orders.totalBatches" defaultMessage="TOTAL BATCHES" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={totalBatches} />
            </Display>
          }
        />
        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.Orders.totalVolume" defaultMessage="Total Volume" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />
            </Display>
          }
        />
      </GridColumn>
    </>
  );
}
