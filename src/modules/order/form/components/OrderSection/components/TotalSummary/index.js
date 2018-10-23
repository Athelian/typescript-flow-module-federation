// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import QuantityChart from 'components/QuantityChart';
import Icon from 'components/Icon';
import TotalSubItemStyle from './style';

type Props = {
  orderedQuantity: number,
  batchedQuantity: number,
  shippedQuantity: number,

  currency: string,
  totalPrice: number,
  totalItems: number,

  activeBatches: number,
  archivedBatches: number,
};

export default function TotalSummary({
  orderedQuantity,
  batchedQuantity,
  shippedQuantity,
  currency,
  totalPrice,
  totalItems,
  activeBatches,
  archivedBatches,
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
              <FormattedNumber value={activeBatches + archivedBatches} />
              <div className={TotalSubItemStyle}>
                <Icon icon="ACTIVE" /> <FormattedNumber value={activeBatches} />
                <Icon icon="ARCHIVE" /> <FormattedNumber value={archivedBatches} />
              </div>
            </Display>
          }
        />
      </GridColumn>
    </>
  );
}
