// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { orderItemFormQuery } from 'modules/orderItem/form/query';
import { prepareParsedBatchInput } from 'modules/batch/form/mutation';
import { generateBatchByOrderItem } from 'utils/batch';
import { removeTypename } from 'utils/data';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import ActionDialog, { BatchLabelIcon } from 'components/Dialog/ActionDialog';
import { createBatchMutation } from './mutation';

type Props = {|
  onSuccess: (orderId: string) => void,
|};

export default function InlineCreateBatch({ onSuccess }: Props) {
  const { mapping, onSetBadges } = Entities.useContainer();
  const { dispatch, state } = FocusedView.useContainer();
  const {
    isOpen,
    isProcessing,
    detail: { entity },
    type,
  } = state.itemActions;
  const [createBatch, batchResult] = useMutation(createBatchMutation);
  const [loadOrderItem, itemResult] = useLazyQuery(orderItemFormQuery, {
    // NOTE: there is a tricky part for fixing the inline create for the same item from 3rd times
    // Even its said no cache but it only fires 1 time.
    fetchPolicy: 'no-cache',
  });

  const isBatchCreation = type === 'createBatch';
  const itemId = entity.id;
  const orderItem = itemResult.data?.orderItem ?? {};
  const totalBatches = mapping.entities?.orderItems?.[itemId]?.batches?.length || 0;
  React.useEffect(() => {
    if (itemId && isBatchCreation && isOpen && !itemResult.loading) {
      loadOrderItem({
        variables: { id: itemId },
      });
    }
  }, [isBatchCreation, isOpen, itemId, itemResult.loading, loadOrderItem]);

  React.useEffect(() => {
    if (
      isOpen &&
      isBatchCreation &&
      !isProcessing &&
      !itemResult.loading &&
      orderItem.id &&
      orderItem.id === itemId
    ) {
      dispatch({
        type: 'CREATE_BATCH_START',
        payload: {},
      });
      const batchInput = removeTypename(generateBatchByOrderItem(orderItem));
      createBatch({
        variables: {
          input: {
            orderItemId: itemId,
            ...prepareParsedBatchInput(
              {},
              {
                ...batchInput,
                no: `batch no ${totalBatches + 1}`,
                archived: orderItem?.archived,
              },
              { inOrderForm: true }
            ),
          },
        },
      });
    }
  }, [
    createBatch,
    dispatch,
    isBatchCreation,
    isOpen,
    isProcessing,
    itemId,
    itemResult.loading,
    orderItem,
    totalBatches,
  ]);

  React.useEffect(() => {
    if (isProcessing && isOpen && isBatchCreation) {
      if (batchResult.data && batchResult.data) {
        dispatch({
          type: 'CREATE_BATCH_END',
          payload: {
            batch: batchResult.data?.batchCreate ?? {},
          },
        });
        onSuccess(batchResult.data?.batchCreate?.orderItem?.order?.id);
        onSetBadges([{ entity: 'batch', id: batchResult.data?.batchCreate?.id, type: 'newItem' }]);
      } else if (batchResult.error) {
        dispatch({
          type: 'CREATE_BATCH_END',
          payload: {
            error: batchResult.error,
          },
        });
      }
    }
  }, [
    batchResult.data,
    batchResult.error,
    dispatch,
    isBatchCreation,
    isOpen,
    isProcessing,
    onSetBadges,
    onSuccess,
  ]);

  return (
    <ActionDialog
      isOpen={isOpen && isBatchCreation}
      isProcessing
      onCancel={() => {}}
      title={
        <FormattedMessage
          id="modules.RelationMap.label.createBatch"
          defaultMessage="CREATE BATCH"
        />
      }
      dialogMessage={
        <FormattedMessage
          id="modules.RelationMap.createBatch.creating"
          defaultMessage="Creating {batchLabel} ..."
          values={{ batchLabel: <BatchLabelIcon /> }}
        />
      }
      buttons={null}
    />
  );
}
