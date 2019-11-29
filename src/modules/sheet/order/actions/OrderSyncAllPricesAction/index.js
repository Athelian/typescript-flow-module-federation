// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { ItemsLabelIcon, EndProductsLabelIcon } from 'components/Dialog/ActionDialog';
import { removeTypename } from 'utils/data';
import messages from '../messages';
import { syncAllPricesOrderActionMutation } from './mutation';
import { syncAllPricesProductProvidersQuery } from './query';

type Props = {|
  getUniqueProductProvidersIds: (item: Object) => Array<string>,
  getOrderItemsProductProvidersMapping: (
    item: Object,
    productProviders: Array<Object>
  ) => { orderItemsMapping: Array<Object>, numOfOrderItemsAbleToSync: number },
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const OrderSyncAllPricesActionImpl = ({
  entity,
  item,
  onDone,
  getUniqueProductProvidersIds,
  getOrderItemsProductProvidersMapping,
}: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [updateOrder, { loading: processing, called }] = useMutation(
    syncAllPricesOrderActionMutation
  );

  const uniqueProductProviderIds = getUniqueProductProvidersIds(item);

  const { data, loading } = useQuery(syncAllPricesProductProvidersQuery, {
    variables: { ids: uniqueProductProviderIds },
    fetchPolicy: 'network-only',
  });
  const productProviders = removeTypename(data?.productProvidersByIDs ?? []);

  const { orderItemsMapping, numOfOrderItemsAbleToSync } = getOrderItemsProductProvidersMapping(
    item,
    productProviders
  );

  const numOfOrderItems = item?.orderItems?.length ?? 0;

  const cannotSync = numOfOrderItemsAbleToSync === 0;

  let dialogMessage = null;

  if (processing || called) {
    dialogMessage = (
      <FormattedMessage
        {...messages.syncAllPricesSyncing}
        values={{
          numOfValidItems: <FormattedNumber value={numOfOrderItemsAbleToSync} />,
          itemsLabel: <ItemsLabelIcon />,
        }}
      />
    );
  } else if (cannotSync) {
    dialogMessage = (
      <FormattedMessage
        {...messages.syncAllPricesRestrictedMessage}
        values={{ endProductsLabel: <EndProductsLabelIcon />, itemsLabel: <ItemsLabelIcon /> }}
      />
    );
  } else {
    dialogMessage = (
      <FormattedMessage
        {...messages.syncAllPricesMessage}
        values={{
          numOfValidItems: <FormattedNumber value={numOfOrderItemsAbleToSync} />,
          numOfItems: <FormattedNumber value={numOfOrderItems} />,
          endProductsLabel: <EndProductsLabelIcon />,
          itemsLabel: <ItemsLabelIcon />,
        }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={processing || called || loading}
      onCancel={close}
      title={<FormattedMessage {...messages.syncAllPricesTitle} />}
      dialogMessage={dialogMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage {...messages.syncAllPricesSyncButton} />}
          icon="SYNC"
          disabled={loading || cannotSync}
          onClick={() => {
            executeActionMutation(
              updateOrder,
              {
                id: entity.id,
                input: {
                  orderItems: orderItemsMapping.map(orderItem => {
                    return {
                      id: orderItem?.id,
                      ...(orderItem?.currencyMatches
                        ? {
                            price: {
                              amount: orderItem?.productProvider?.unitPrice?.amount,
                              currency: orderItem?.productProvider?.unitPrice?.currency,
                            },
                          }
                        : {}),
                    };
                  }),
                },
              },
              close
            );
          }}
        />
      }
    />
  );
};

const OrderSyncAllPricesAction = ({
  getUniqueProductProvidersIds,
  getOrderItemsProductProvidersMapping,
}: Props) => (props: ActionComponentProps) => (
  <OrderSyncAllPricesActionImpl
    {...props}
    getUniqueProductProvidersIds={getUniqueProductProvidersIds}
    getOrderItemsProductProvidersMapping={getOrderItemsProductProvidersMapping}
  />
);

export default OrderSyncAllPricesAction;
