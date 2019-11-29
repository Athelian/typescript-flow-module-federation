// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, {
  BatchesLabelIcon,
  BatchLabelIcon,
  ItemLabelIcon,
} from 'components/Dialog/ActionDialog';
import messages from '../messages';
import autofillOrderItemActionMutation from './mutation';

type Props = {|
  getAutofillable: (orderItemId: string, item: Object) => boolean,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const OrderItemAutofillActionImpl = ({ entity, item, onDone, getAutofillable }: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [autofillOrderItem, { loading, called }] = useMutation(autofillOrderItemActionMutation);

  const canAutofill = getAutofillable(entity.id, item);

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (loading || called) {
    dialogMessage = (
      <FormattedMessage
        {...messages.orderItemAutofillAutofilling}
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
  } else if (!canAutofill) {
    dialogMessage = (
      <FormattedMessage
        {...messages.orderItemAutofillRestrictedMessage}
        values={{
          itemLabel: <ItemLabelIcon />,
          batchesLabel: <BatchesLabelIcon />,
        }}
      />
    );
  } else {
    dialogMessage = (
      <FormattedMessage
        {...messages.orderItemAutofillMessage}
        values={{ itemLabel: <ItemLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        {...messages.orderItemAutofillSubMessage}
        values={{
          batchLabel: <BatchLabelIcon />,
          itemLabel: <ItemLabelIcon />,
        }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={loading || called}
      title={<FormattedMessage {...messages.orderItemAutofillTitle} />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      onCancel={close}
      buttons={
        <BaseButton
          label={<FormattedMessage {...messages.orderItemAutofillButton} />}
          icon="QUANTITY_ADJUSTMENTS"
          disabled={!canAutofill}
          onClick={() => {
            executeActionMutation(
              autofillOrderItem,
              {
                id: entity.id,
              },
              close
            );
          }}
        />
      }
    />
  );
};

const OrderItemAutofillAction = ({ getAutofillable }: Props) => (props: ActionComponentProps) => (
  <OrderItemAutofillActionImpl {...props} getAutofillable={getAutofillable} />
);

export default OrderItemAutofillAction;
