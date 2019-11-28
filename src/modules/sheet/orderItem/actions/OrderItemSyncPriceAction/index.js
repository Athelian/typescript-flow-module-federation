// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import FormattedNumber from 'components/FormattedNumber';
import { FieldItem, Display, Label } from 'components/Form';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { ItemLabelIcon, EndProductLabelIcon } from 'components/Dialog/ActionDialog';
import { removeTypename } from 'utils/data';
import messages from '../messages';
import { syncPriceOrderItemActionMutation } from './mutation';
import { syncPriceProductProviderQuery } from './query';
import { BodyWrapperStyle } from './style';

type Props = {
  ...ActionComponentProps,
  getProductProviderId: (orderItemId: string, item: Object) => ?string,
};

const OrderItemSyncPriceActionImpl = ({ entity, item, onDone, getProductProviderId }: Props) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [updateOrderItem, { loading: processing, called }] = useMutation(
    syncPriceOrderItemActionMutation
  );

  const productProviderId = getProductProviderId(entity.id, item);
  const { data, loading } = useQuery(syncPriceProductProviderQuery, {
    variables: { id: productProviderId },
    fetchPolicy: 'network-only',
  });
  const productProvider = removeTypename(data?.productProvider ?? null);

  const cannotSync = productProvider?.unitPrice?.currency !== item?.currency;

  let dialogMessage = null;

  if (processing || called) {
    dialogMessage = (
      <FormattedMessage
        {...messages.orderItemSyncPriceSyncing}
        values={{ orderItemLabel: <ItemLabelIcon /> }}
      />
    );
  } else if (cannotSync) {
    dialogMessage = (
      <FormattedMessage
        {...messages.orderItemSyncPriceRestrictedMessage}
        values={{ endProductLabel: <EndProductLabelIcon />, orderItemLabel: <ItemLabelIcon /> }}
      />
    );
  } else {
    dialogMessage = (
      <FormattedMessage
        {...messages.orderItemSyncPriceMessage}
        values={{ endProductLabel: <EndProductLabelIcon />, orderItemLabel: <ItemLabelIcon /> }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={processing || called}
      onCancel={close}
      title={<FormattedMessage {...messages.orderItemSyncPriceTitle} />}
      dialogMessage={dialogMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage {...messages.orderItemSyncPriceSyncButton} />}
          icon="SYNC"
          disabled={loading || cannotSync}
          onClick={() => {
            executeActionMutation(
              updateOrderItem,
              {
                id: entity.id,
                input: {
                  price: productProvider?.unitPrice,
                },
              },
              close
            );
          }}
        />
      }
    >
      <div className={BodyWrapperStyle}>
        {loading ? (
          <LoadingIcon />
        ) : (
          <FieldItem
            vertical
            label={<Label align="center">End Product's Unit Price</Label>}
            input={
              <Display align="center">
                <FormattedNumber value={productProvider?.unitPrice?.amount} />
                {` ${productProvider?.unitPrice?.currency}`}
              </Display>
            }
          />
        )}
      </div>
    </ActionDialog>
  );
};

const OrderItemSyncPriceAction = (
  getProductProviderId: (orderItemId: string, order: Object) => ?string
) => (props: ActionComponentProps) => (
  <OrderItemSyncPriceActionImpl {...props} getProductProviderId={getProductProviderId} />
);

export default OrderItemSyncPriceAction;
