// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ContainerFormContainer from 'modules/container/form/container';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';

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
        } = values;
        return (
          <>
            <GridColumn>
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.container.totalPackages"
                      defaultMessage="TOTAL PACKAGE"
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
                      defaultMessage="TOTAL BATCH QUANTITY"
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
                      defaultMessage="TOTAL UNIQUE ITEMS"
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
                    <FormattedNumber value={totalPrice.value} suffix={totalPrice.metric} />
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
