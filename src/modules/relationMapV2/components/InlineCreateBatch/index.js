// @flow
import * as React from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { orderItemFormQuery } from 'modules/orderItem/form/query';
import { prepareParsedBatchInput } from 'modules/batch/form/mutation';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { generateBatchByOrderItem } from 'utils/batch';
import { removeTypename } from 'utils/data';
import { Entities } from 'modules/relationMapV2/store';
import { DialogStyle, ConfirmMessageStyle } from './style';
import { createBatchMutation } from './mutation';

type Props = {|
  isOpen: boolean,
  entity: {
    no: string,
    id: string,
  },
  isProcessing?: boolean,
  onSuccess: string => void,
|};

export default function InlineCreateBatch({ isOpen, isProcessing, entity, onSuccess }: Props) {
  const { mapping, onSetBadge } = Entities.useContainer();
  const { dispatch } = React.useContext(RelationMapContext);
  const [createBatch, batchResult] = useMutation(createBatchMutation);
  const [loadOrderItem, itemResult] = useLazyQuery(orderItemFormQuery, {
    // NOTE: there is a tricky part for fixing the inline create for the same item from 3rd times
    // Even its said no cache but it only fires 1 time.
    fetchPolicy: 'no-cache',
  });

  const itemId = entity.id;
  const orderItem = itemResult.data?.orderItem ?? {};
  const totalBatches = mapping.entities?.orderItems?.[itemId]?.batches?.length || 0;
  React.useEffect(() => {
    if (itemId && isOpen && !itemResult.loading) {
      loadOrderItem({
        variables: { id: itemId },
      });
    }
  }, [isOpen, itemId, itemResult.loading, loadOrderItem]);

  React.useEffect(() => {
    if (!isProcessing && !itemResult.loading && orderItem.id && orderItem.id === itemId) {
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
  }, [createBatch, dispatch, isProcessing, itemId, itemResult.loading, orderItem, totalBatches]);

  React.useEffect(() => {
    if (isProcessing) {
      if (batchResult.data && batchResult.data) {
        dispatch({
          type: 'CREATE_BATCH_END',
          payload: batchResult.data,
        });
        onSuccess(batchResult.data?.batchCreate?.orderItem?.order?.id);
        onSetBadge(batchResult.data?.batchCreate?.id, 'newItem');
      } else if (batchResult.error) {
        dispatch({
          type: 'CREATE_BATCH_END',
          payload: batchResult.error,
        });
      }
    }
  }, [batchResult.data, batchResult.error, dispatch, isProcessing, onSetBadge, onSuccess]);

  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Creating new <Icon icon="BATCH" /> from <Icon icon="ORDER_ITEM" /> {` ${entity.no}?`}
        </h3>
        <LoadingIcon />
      </div>
    </Dialog>
  );
}
