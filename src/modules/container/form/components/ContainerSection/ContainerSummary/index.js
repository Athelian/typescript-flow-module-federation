// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { ContainerInfoContainer } from 'modules/container/form/containers';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import { Tooltip } from 'components/Tooltip';
import { isNullOrUndefined } from 'utils/fp';
import { findSummary } from './helper';

export default function ContainerSummary() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  return (
    <Subscribe to={[ContainerInfoContainer]}>
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
                    {totalVolume && (
                      <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />
                    )}
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
                  <Display blackout={!hasPermission(ORDER_ITEMS_GET_PRICE)}>
                    {isNullOrUndefined(totalPrice) ? (
                      <Tooltip
                        message={
                          <FormattedMessage
                            id="modules.container.totalPriceUnavailable"
                            defaultMessage="Cannot calculate due to mixed currencies"
                          />
                        }
                      >
                        <FormattedMessage
                          id="modules.Containers.invalid"
                          defaultMessage="Invalid"
                        />
                      </Tooltip>
                    ) : (
                      <FormattedNumber
                        value={totalPrice && totalPrice.amount}
                        suffix={totalPrice && totalPrice.currency}
                      />
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
