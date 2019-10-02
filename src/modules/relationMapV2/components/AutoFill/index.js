// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAllHasPermission } from 'components/Context/Permissions';
import { useMutation } from '@apollo/react-hooks';
import { Entities } from 'modules/relationMapV2/store';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { ORDER_ITEM } from 'modules/relationMapV2/constants';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, YesButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { batchBalanceSplitManyMutation } from './mutation';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: (itemIds: Array<string>, batchIds: Array<string>) => void,
|};

export default function AutoFill({ onSuccess }: Props) {
  const [autoFill] = useMutation(batchBalanceSplitManyMutation);
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { isProcessing, isOpen } = state.autoFill;
  const orderItemIds = targetedIds(state.targets, ORDER_ITEM);
  const hasPermission = useAllHasPermission(
    orderItemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy).filter(Boolean)
  );
  const itemsWithHigherQuantity = orderItemIds.filter(itemId => {
    const item = mapping.entities?.orderItems?.[itemId];
    const totalBatchQuantity = (item?.batches ?? []).reduce((total, batchId) => {
      return total + (mapping?.entities?.batches?.[batchId]?.latestQuantity ?? 0);
    }, 0);
    return (item?.quantity ?? 0) > totalBatchQuantity;
  });
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

  if (noPermission) {
    return (
      <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
        <div className={DialogStyle}>
          <h3 className={ConfirmMessageStyle}>
            <FormattedMessage
              id="modules.RelationMap.autoFill.noPermission"
              defaultMessage="At least one {source} {entity} selected does not allow you to autofill.Please reselect and try again."
              values={{
                source: 'Item',
                entity: <Icon icon="ORDER_ITEM" />,
              }}
            />
          </h3>
          <div className={ButtonsStyle}>
            <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          </div>
        </div>
      </Dialog>
    );
  }
  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      <div className={DialogStyle}>
        {isProcessing ? (
          <>
            <FormattedMessage
              id="modules.RelationMap.autoFill.process"
              defaultMessage="Autofilling Batches {batch} for {total} Items {entity} ..."
              values={{
                total: itemsWithHigherQuantity.length,
                batch: <Icon icon="BATCH" />,
                entity: <Icon icon="ORDER_ITEM" />,
              }}
            />
            <LoadingIcon />
          </>
        ) : (
          <h3 className={ConfirmMessageStyle}>
            <FormattedMessage
              id="modules.RelationMap.autoFill.guideline"
              defaultMessage="You have selected {total} Items {entity} have more quantity than their Batches {batch}.Would you like to generate a new Batch {batch} which fills up the remaining quantities for each of these Items {entity}"
              values={{
                total: itemsWithHigherQuantity.length,
                batch: <Icon icon="BATCH" />,
                entity: <Icon icon="ORDER_ITEM" />,
              }}
            />
          </h3>
        )}
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <YesButton
            disabled={Boolean(isProcessing) || allDoesNotHaveHigherQuantity}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  );
}
