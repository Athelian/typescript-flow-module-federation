// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ContainerFormContainer from 'modules/container/form/container';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import Tooltip from 'components/Tooltip';
import { isNullOrUndefined } from 'utils/fp';
import { findSummary } from './helper';

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
