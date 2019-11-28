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

const OrderSyncAllPricesAction = ({ entity, item, onDone }: ActionComponentProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [updateOrder, { loading: processing, called }] = useMutation(
    syncAllPricesOrderActionMutation
  );

  const uniqueProductProviderIds = [
    ...new Set((item?.orderItems ?? []).map(orderItem => orderItem?.productProvider?.id)),
  ];

  const { data, loading } = useQuery(syncAllPricesProductProvidersQuery, {
    variables: { ids: uniqueProductProviderIds },
    fetchPolicy: 'network-only',
  });
  const productProviders = removeTypename(data?.productProvidersByIDs ?? []);

  const numOfOrderItems = item?.orderItems?.length ?? 0;
  let numOfOrderItemsAbleToSync = 0;

  const orderItemsMapping = (item?.orderItems ?? []).map(orderItem => {
    const matchedProductProvider = productProviders.find(
      productProvider => productProvider.id === orderItem?.productProvider?.id
    );

    const currencyMatches = matchedProductProvider?.unitPrice?.currency === item?.currency;
    if (currencyMatches) {
      numOfOrderItemsAbleToSync += 1;
    }

    return {
      ...orderItem,
      productProvider: {
        ...matchedProductProvider,
      },
      currencyMatches,
    };
  });

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

export default OrderSyncAllPricesAction;
