// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAllHasPermission } from 'components/Context/Permissions';
import { useMutation } from '@apollo/react-hooks';
import { Entities, OrderFocused } from 'modules/relationMapV2/store';

import { ORDER_ITEM } from 'modules/relationMapV2/constants';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import { BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import ActionDialog, {
  ItemsLabelIcon,
  ItemLabelIcon,
  BatchesLabelIcon,
  BatchLabelIcon,
} from '../ActionDialog';
import { batchBalanceSplitManyMutation } from './mutation';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: (itemIds: Array<string>, batchIds: Array<string>) => void,
|};

export default function AutoFill({ onSuccess }: Props) {
  const [autoFill] = useMutation(batchBalanceSplitManyMutation);
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = OrderFocused.useContainer();
  const { isProcessing, isOpen } = state.autoFill;
  const orderItemIds = targetedIds(state.targets, ORDER_ITEM);
  const hasPermission = useAllHasPermission(
    orderItemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy).filter(Boolean)
  );
  const totalOrderItems = orderItemIds.length;
  const itemsWithHigherQuantity = orderItemIds.filter(itemId => {
    const item = mapping.entities?.orderItems?.[itemId];
    const totalBatchQuantity = (item?.batches ?? []).reduce((total, batchId) => {
      return total + (mapping?.entities?.batches?.[batchId]?.latestQuantity ?? 0);
    }, 0);
    return (item?.quantity ?? 0) > totalBatchQuantity;
  });
  const totalItemsWithHigherQuantity = itemsWithHigherQuantity.length;

  const onCancel = () => {
    dispatch({
      type: 'AUTO_FILL_CLOSE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'AUTO_FILL_START',
      payload: {},
    });
    autoFill({
      variables: {
        orderItemIds: itemsWithHigherQuantity,
      },
    })
      .then(result => {
        const batchIds = [];
        (result.data?.batchBalanceSplitMany ?? []).forEach(({ batches = [] }) => {
          batchIds.push(...batches.map(batch => batch.id));
        });
        onSuccess(itemsWithHigherQuantity, batchIds);
      })
      .catch(() => {
        dispatch({
          type: 'AUTO_FILL_CLOSE',
          payload: {},
        });
      });
  };
  const allowToUpdate = () => {
    return hasPermission([ORDER_ITEMS_UPDATE]);
  };

  const allDoesNotHaveHigherQuantity = itemsWithHigherQuantity.length === 0;
  const noPermission = !allowToUpdate();

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (noPermission) {
    // No permission to autofill
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.autofill.noPermission"
        defaultMessage="At least one {itemLabel} selected does not allow you to autofill."
        values={{ itemLabel: <ItemLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else if (isProcessing) {
    // Is currently autofilling
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.autofill.autofilling"
        defaultMessage="Autofilling {numOfItems} {itemsLabel} ..."
        values={{
          numOfItems: <FormattedNumber value={totalOrderItems} />,
          itemsLabel: <ItemsLabelIcon />,
        }}
      />
    );
  } else if (allDoesNotHaveHigherQuantity) {
    // Has permission to autofill but no items have enough quantity
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.autofill.notEnoughQuantity"
        defaultMessage="None of the {itemsLabel} selected have more quantity than the sum of their {batchesLabel} quantities."
        values={{ itemsLabel: <ItemsLabelIcon />, batchesLabel: <BatchesLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else {
    // Has permission to autofill and can autofill
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.autofill.message1"
        defaultMessage="Are you sure you want to autofill {numOfValidItems} / {numOfItems} {itemsLabel} that you have selected?"
        values={{
          numOfValidItems: <FormattedNumber value={totalItemsWithHigherQuantity} />,
          numOfItems: <FormattedNumber value={totalOrderItems} />,
          itemsLabel: <ItemsLabelIcon />,
        }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.autofill.message2"
        defaultMessage="This will create a {batchLabel} for each {itemLabel} with its quantity set as the remaining quantity of the {itemLabel}. Only {itemsLabel} with quantities higher than the sum of quantities of their {batchesLabel} can be autofilled"
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
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.RelationMap.label.autofill" defaultMessage="AUTOFILL" />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <BaseButton
          label={
            <FormattedMessage id="modules.RelationMap.label.autofill" defaultMessage="AUTOFILL" />
          }
          icon="QUANTITY_ADJUSTMENTS"
          disabled={noPermission || allDoesNotHaveHigherQuantity}
          onClick={onConfirm}
        />
      }
    />
  );
}
