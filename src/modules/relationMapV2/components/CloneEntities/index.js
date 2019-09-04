// @flow
import * as React from 'react';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { useMutation } from '@apollo/react-hooks';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { cloneBatchMutation } from './mutation';
import { DialogStyle, ConfirmMessageStyle } from './style';

type Props = {|
  onSuccess: (Array<{ id: string, type: string }>, Array<Object>) => void,
|};

export default function CloneEntities({ onSuccess }: Props) {
  const { dispatch, state } = React.useContext(RelationMapContext);
  const [cloneBatch] = useMutation(cloneBatchMutation);
  const {
    targets,
    clone: { isOpen, isProcessing },
  } = state;

  const totalOrders = targets.filter(target => target.includes(`${ORDER}-`)).length;
  const totalOrderItems = targets.filter(target => target.includes(`${ORDER_ITEM}-`)).length;
  const totalBatches = targets.filter(target => target.includes(`${BATCH}-`)).length;
  const totalContainers = targets.filter(target => target.includes(`${CONTAINER}-`)).length;
  const totalShipments = targets.filter(target => target.includes(`${SHIPMENT}-`)).length;

  React.useEffect(() => {
    if (isOpen && !isProcessing) {
      dispatch({
        type: 'CLONE_START',
        payload: {},
      });
    }
  }, [dispatch, isOpen, isProcessing]);

  React.useEffect(() => {
    async function doMutations() {
      const actions = [];
      const sources = [];
      if (totalBatches) {
        const batchIds = targets.filter(target => target.includes(`${BATCH}-`));
        batchIds.forEach(target => {
          const [, batchId] = target.split('-');
          sources.push({
            type: BATCH,
            id: batchId,
          });
          actions.push(
            cloneBatch({
              variables: {
                id: batchId,
                input: {
                  deliveredAt: null,
                  desiredAt: null,
                  expiredAt: null,
                  customFields: null,
                  producedAt: null,
                  batchQuantityRevisions: [],
                },
              },
            })
          );
        });
      }
      try {
        const entities = await Promise.all(actions);
        dispatch({
          type: 'CLONE_END',
          payload: {
            sources,
            entities,
          },
        });
        onSuccess(sources, entities);
      } catch (error) {
        dispatch({
          type: 'CLONE_END',
          payload: {
            error,
          },
        });
      }
    }
    if (isProcessing && isOpen) {
      doMutations();
    }
  }, [cloneBatch, dispatch, isOpen, isProcessing, onSuccess, targets, totalBatches]);

  return (
    <Dialog isOpen={isOpen} width="400px">
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Cloning{' '}
          {totalOrders > 0 && (
            <>
              {totalOrders} <Icon icon="ORDER" />
            </>
          )}{' '}
          {totalOrderItems > 0 && (
            <>
              {totalOrderItems} <Icon icon="ORDER_ITEM" />
            </>
          )}{' '}
          {totalBatches > 0 && (
            <>
              {totalBatches} <Icon icon="BATCH" />
            </>
          )}{' '}
          {totalContainers > 0 && (
            <>
              {totalContainers} <Icon icon="CONTAINER" />
            </>
          )}{' '}
          {totalShipments > 0 && (
            <>
              {totalShipments} <Icon icon="SHIPMENT" />
            </>
          )}{' '}
          {`...`}
        </h3>
        <LoadingIcon />
      </div>
    </Dialog>
  );
}
