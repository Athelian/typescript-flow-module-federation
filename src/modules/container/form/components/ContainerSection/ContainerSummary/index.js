// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ContainerFormContainer from 'modules/container/form/container';
import { calculateVolume } from 'modules/batch/form/container';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import Tooltip from 'components/Tooltip';
import { totalAdjustQuantity } from 'components/Cards/utils';
import { isNullOrUndefined } from 'utils/fp';

const findSummary = values => {
  const { batches, totalVolume, totalWeight, totalPrice } = values;
  let totalBatchQuantity = 0;
  let totalPriceAmount = 0;
  let totalVolumeValue = 0;
  let totalWeightValue = 0;
  let totalBatchPackages = 0;
  const uniqueItems = [];
  (batches || []).forEach(batch => {
    const { quantity, orderItem, batchAdjustments, packageQuantity = 0 } = batch;
    totalBatchQuantity += quantity + totalAdjustQuantity(batchAdjustments);
    totalBatchPackages += packageQuantity;
    if (orderItem) {
      const { price, productProvider } = orderItem;
      if (!uniqueItems.includes(orderItem && orderItem.id)) {
        uniqueItems.push(orderItem.id);
      }
      totalPriceAmount += price.amount * totalBatchQuantity;
      totalVolumeValue +=
        packageQuantity *
        calculateVolume(
          productProvider.packageVolume.metric,
          productProvider.packageSize.height,
          productProvider.packageSize.width,
          productProvider.packageSize.length
        );
      totalWeightValue += productProvider.packageGrossWeight
        ? packageQuantity * productProvider.packageGrossWeight.value
        : 0;
    }
  });
  return {
    totalBatchQuantity,
    totalBatchPackages,
    totalNumberOfUniqueOrderItems: uniqueItems.length,
    totalPrice: {
      ...totalPrice,
      amount: totalPriceAmount,
    },
    totalVolume: {
      ...totalVolume,
      value: totalVolumeValue,
    },
    totalWeight: {
      ...totalWeight,
      value: totalWeightValue,
    },
  };
};

export default function ContainerSummary() {
  return (
    <Subscribe to={[ContainerFormContainer]}>
      {({ originalValues, state }) => {
        const values = { ...originalValues, ...state };
        const {
          totalBatchPackages,
          totalBatchQuantity,
          totalNumberOfUniqueOrderItems,
          totalVolume,
          totalWeight,
          totalPrice,
        } = findSummary(values);
        return (
          <>
            <GridColumn>
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.container.totalPackages"
                      defaultMessage="TOTAL PACKAGES"
                    />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={totalBatchPackages} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.container.totalBatchQuantity"
                      defaultMessage="BATCHED QTY"
                    />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={totalBatchQuantity} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.container.totalUniqueItems"
                      defaultMessage="UNIQUE ITEMS"
                    />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={totalNumberOfUniqueOrderItems} />
                  </Display>
                }
              />
            </GridColumn>
            <GridColumn>
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.container.totalVolume"
                      defaultMessage="TOTAL VOLUME"
                    />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.container.totalWeight"
                      defaultMessage="TOTAL WEIGHT"
                    />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={totalWeight.value} suffix={totalWeight.metric} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.container.totalPrice"
                      defaultMessage="TOTAL PRICE"
                    />
                  </Label>
                }
                input={
                  <Display>
                    {isNullOrUndefined(totalPrice) ? (
                      <Tooltip
                        message={
                          <FormattedMessage
                            id="modules.container.totalPriceUnavailable"
                            defaultMessage="Cannot calculate due to mixed currencies"
                          />
                        }
                      >
                        <span>N/A</span>
                      </Tooltip>
                    ) : (
                      <FormattedNumber value={totalPrice.amount} suffix={totalPrice.currency} />
                    )}
                  </Display>
                }
              />
            </GridColumn>
          </>
        );
      }}
    </Subscribe>
  );
}
