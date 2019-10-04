// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useAllHasPermission } from 'components/Context/Permissions';
import { Entities, OrderFocused } from 'modules/relationMapV2/store';
import { BATCH_DELETE, BATCH_UPDATE } from 'modules/permission/constants/batch';

import { BATCH } from 'modules/relationMapV2/constants';
import { BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import ActionDialog, { BatchesLabelIcon, BatchLabelIcon } from '../ActionDialog';
import { targetedIds } from '../OrderFocus/helpers';
import { deleteBatchMutation } from '../DeleteBatchConfirm/mutation';
import { entitiesUpdateManyMutation } from '../AddTags/mutation';

type Props = {|
  onSuccess: (batchIds: Array<string>, isRemoveTargeting: boolean) => void,
|};

export default function DeleteBatchesConfirm({ onSuccess }: Props) {
  const { mapping } = Entities.useContainer();
  const [deleteBatch] = useMutation(deleteBatchMutation);
  const [updateEntities] = useMutation(entitiesUpdateManyMutation);
  const { dispatch, state } = OrderFocused.useContainer();
  const { isProcessing, isRemove, isOpen } = state.deleteBatches;
  const batchIds = targetedIds(state.targets, BATCH);
  const isDisableRemovedContainerButton =
    batchIds.filter(batchId => mapping.entities?.batches?.[batchId]?.container).length === 0;
  const isDisableRemovedShipmentButton =
    batchIds.filter(batchId => mapping.entities?.batches?.[batchId]?.shipment).length === 0;
  const totalBatches = batchIds.length;
  const hasPermissions = useAllHasPermission(
    batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.ownedBy).filter(Boolean)
  );

  const onCancel = () => {
    dispatch({
      type: 'DELETE_BATCHES_CLOSE',
      payload: {},
    });
  };
  const onConfirm = (type: 'delete' | 'removeFromShipment' | 'removeFromContainer') => {
    dispatch({
      type: 'DELETE_BATCHES_START',
      payload: {
        isRemove: type.includes('remove'),
      },
    });
    switch (type) {
      case 'delete':
        Promise.all(
          batchIds.map(id =>
            deleteBatch({
              variables: {
                id,
              },
            })
          )
        )
          .then(() => {
            onSuccess(batchIds, true);
          })
          .catch(() => {
            dispatch({
              type: 'DELETE_BATCHES_CLOSE',
              payload: {},
            });
          });
        break;

      case 'removeFromContainer': {
        const batchesInput = batchIds.map(id => ({
          id,
          input: {
            containerId: null,
          },
        }));
        updateEntities({
          variables: {
            orders: [],
            orderItems: [],
            batches: batchesInput,
            containers: [],
            shipments: [],
          },
        })
          .then(() => {
            onSuccess(batchIds, false);
          })
          .catch(() => {
            dispatch({
              type: 'DELETE_BATCHES_CLOSE',
              payload: {},
            });
          });
        break;
      }

      default: {
        const batchesInput = batchIds.map(id => ({
          id,
          input: {
            containerId: null,
            shipmentId: null,
          },
        }));
        updateEntities({
          variables: {
            orders: [],
            orderItems: [],
            batches: batchesInput,
            containers: [],
            shipments: [],
          },
        })
          .then(() => {
            onSuccess(batchIds, false);
          })
          .catch(() => {
            dispatch({
              type: 'DELETE_BATCHES_CLOSE',
              payload: {},
            });
          });
      }
    }
  };

  const allowToDeleteBatches = hasPermissions([BATCH_DELETE]);
  const allowToUpdateBatches = hasPermissions([BATCH_UPDATE]);
  const noPermission = !allowToDeleteBatches && !allowToUpdateBatches;

  let dialogMessage = null;
  let dialogSubMessage = null;
  const numOfBatches = <FormattedNumber value={totalBatches} />;

  if (noPermission) {
    // No permission to delete or remove
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteRemove.noPermission"
        defaultMessage="At least one {batchLabel} selected does not allow you to delete nor remove."
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else if (isProcessing) {
    // Is currently deleting or removing
    dialogMessage = isRemove ? (
      <FormattedMessage
        id="modules.RelationMap.deleteRemove.removing"
        defaultMessage="Removing {numOfBatches} {batchesLabel} ..."
        values={{
          numOfBatches,
          batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
        }}
      />
    ) : (
      <FormattedMessage
        id="modules.RelationMap.deleteRemove.deleting"
        defaultMessage="Deleting {numOfBatches} {batchesLabel} ..."
        values={{
          numOfBatches,
          batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
        }}
      />
    );
  } else {
    // Has permission to delete or remove
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteBatches.message"
        defaultMessage="Would you like to delete or remove {numOfBatches} {batchesLabel} that you have selected?"
        values={{
          numOfBatches,
          batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
        }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={
        <FormattedMessage
          id="modules.RelationMap.label.deleteRemove"
          defaultMessage="DELETE/REMOVE"
        />
      }
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <>
          <BaseButton
            label={
              <FormattedMessage id="modules.RelationMap.label.delete" defaultMessage="DELETE" />
            }
            icon="REMOVE"
            disabled={!allowToDeleteBatches}
            onClick={() => onConfirm('delete')}
            backgroundColor="RED"
            hoverBackgroundColor="RED_DARK"
          />
          <BaseButton
            label={
              <>
                <FormattedMessage
                  id="modules.RelationMap.label.removeFrom"
                  defaultMessage="REMOVE FROM"
                />{' '}
                <Icon icon="CONTAINER" />
              </>
            }
            icon="CLEAR"
            disabled={!allowToUpdateBatches || isDisableRemovedContainerButton}
            onClick={() => onConfirm('removeFromContainer')}
            textColor="RED"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="RED"
          />
          <BaseButton
            label={
              <>
                <FormattedMessage
                  id="modules.RelationMap.label.removeFrom"
                  defaultMessage="REMOVE FROM"
                />{' '}
                <Icon icon="SHIPMENT" />
              </>
            }
            icon="CLEAR"
            disabled={!allowToUpdateBatches || isDisableRemovedShipmentButton}
            onClick={() => onConfirm('removeFromShipment')}
            textColor="RED"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="RED"
          />
        </>
      }
    />
  );
}
