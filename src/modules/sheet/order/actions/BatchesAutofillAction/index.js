// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, {
  BatchesLabelIcon,
  BatchLabelIcon,
  ItemLabelIcon,
  ItemsLabelIcon,
} from 'components/Dialog/ActionDialog';
import messages from '../messages';
import balanceSplitActionMutation from './mutation';

type Props = {|
  getOrderItemsCount: (orderId: string, item: Object) => number,
  getNotFullyBatchedOrderItemIds: (orderId: string, item: Object) => Array<string>,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const BatchesAutofillActionImpl = ({
  entity,
  item,
  onDone,
  getOrderItemsCount,
  getNotFullyBatchedOrderItemIds,
}: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [balanceSplit, { loading, called }] = useMutation(balanceSplitActionMutation);
  const orderItemsCount = getOrderItemsCount(entity.id, item);
  const orderItemIds = getNotFullyBatchedOrderItemIds(entity.id, item);

  const onAutofill = () => {
    executeActionMutation(
      balanceSplit,
      {
        ids: orderItemIds,
      },
      close
    );
  };

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (loading || called) {
    dialogMessage = (
      <FormattedMessage
        {...messages.batchesAutofilling}
        values={{
          numOfItems: <FormattedNumber value={orderItemIds.length} />,
          itemsLabel: <ItemsLabelIcon />,
        }}
      />
    );
  } else if (orderItemIds.length === 0) {
    dialogMessage = (
      <FormattedMessage
        {...messages.batchesAutofillNone}
        values={{ itemsLabel: <ItemsLabelIcon />, batchesLabel: <BatchesLabelIcon /> }}
      />
    );
  } else {
    dialogMessage = (
      <FormattedMessage
        {...messages.batchesAutofillConfirm}
        values={{
          numOfValidItems: <FormattedNumber value={orderItemIds.length} />,
          numOfItems: <FormattedNumber value={orderItemsCount} />,
          itemsLabel: <ItemsLabelIcon />,
        }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        {...messages.batchesAutofillSubConfirm}
        values={{
          batchLabel: <BatchLabelIcon />,
          itemLabel: <ItemLabelIcon />,
          itemsLabel: <ItemsLabelIcon />,
          batchesLabel: <BatchesLabelIcon />,
        }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={loading || called}
      title={<FormattedMessage {...messages.batchesAutofillTitle} />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      onCancel={close}
      buttons={
        <BaseButton
          label={<FormattedMessage {...messages.batchesAutofillButton} />}
          icon="QUANTITY_ADJUSTMENTS"
          disabled={orderItemIds.length === 0}
          onClick={onAutofill}
        />
      }
    />
  );
};

const BatchesAutofillAction = ({ getOrderItemsCount, getNotFullyBatchedOrderItemIds }: Props) => (
  props: ActionComponentProps
) => (
  <BatchesAutofillActionImpl
    {...props}
    getOrderItemsCount={getOrderItemsCount}
    getNotFullyBatchedOrderItemIds={getNotFullyBatchedOrderItemIds}
  />
);

export default BatchesAutofillAction;
