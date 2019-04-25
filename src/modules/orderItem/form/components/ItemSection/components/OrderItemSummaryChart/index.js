// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import QuantityChart from 'components/QuantityChart';

type Props = {
  orderedQuantity: number,
  batchedQuantity: number,
  shippedQuantity: number,

  totalPrice: {
    amount: number,
    currency: string,
  },
};

export default function OrderItemSummaryChart({
  orderedQuantity,
  batchedQuantity,
  shippedQuantity,

  totalPrice,
}: Props) {
  return (
    <GridColumn>
      <FieldItem
        label={
          <Label>
            <FormattedMessage id="modules.Orders.totalPrice" defaultMessage="TOTAL PRICE" />
          </Label>
        }
        input={
          <Display>
            <FormattedNumber value={totalPrice.amount} suffix={totalPrice.currency} />
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
  );
}
