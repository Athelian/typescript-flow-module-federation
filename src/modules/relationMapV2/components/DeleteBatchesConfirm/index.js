// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useAllHasPermission } from 'components/Context/Permissions';
import { Entities } from 'modules/relationMapV2/store';
import { BATCH_DELETE, BATCH_UPDATE } from 'modules/permission/constants/batch';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { BATCH } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
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
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { isProcessing, isRemove, isOpen } = state.deleteBatches;
  const batchIds = targetedIds(state.targets, BATCH);
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
  const onConfirm = (type: 'delete' | 'remove' | 'removeLocally') => {
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
            onSuccess(batchIds, !isRemove);
          })
          .catch(() => {
            dispatch({
              type: 'DELETE_BATCHES_CLOSE',
              payload: {},
            });
          });
        break;

      case 'removeLocally': {
        const batchesInput = batchIds.map(id =>
          mapping.entities.batches?.[id]?.container
            ? {
                id,
                input: {
                  containerId: null,
                },
              }
            : {
                id,
                input: {
                  shipmentId: null,
                },
              }
        );
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
            onSuccess(batchIds, !isRemove);
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
            onSuccess(batchIds, !isRemove);
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

  if (noPermission)
    return (
      <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
        <div className={DialogStyle}>
          <h3 className={ConfirmMessageStyle}>
            <FormattedMessage
              id="modules.RelationMap.batches.deleteOrRemoveGuideLine"
              defaultMessage="Would you like to delete or remove these  {total, plural, one {# Batch} other {# Batches}} {entity}"
              values={{
                entity: <Icon icon="BATCH" />,
                total: totalBatches,
              }}
            />
          </h3>
          <div className={ButtonsStyle}>
            <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          </div>
        </div>
      </Dialog>
    );

  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      <div className={DialogStyle}>
        {isProcessing ? (
          <>
            {isRemove ? (
              <FormattedMessage
                id="modules.RelationMap.batches.remove"
                defaultMessage="Removing {entity} {total, plural, one {# Batch} other {# Batches}}"
                values={{
                  entity: <Icon icon="BATCH" />,
                  total: totalBatches,
                }}
              />
            ) : (
              <FormattedMessage
                id="modules.RelationMap.batches.delete"
                defaultMessage="Deleting {entity} {total, plural, one {# Batch} other {# Batches}}"
                values={{
                  entity: <Icon icon="BATCH" />,
                  total: totalBatches,
                }}
              />
            )}
            <LoadingIcon />
          </>
        ) : (
          <h3 className={ConfirmMessageStyle}>
            <FormattedMessage
              id="modules.RelationMap.batches.deleteOrRemoveGuideLine"
              defaultMessage="Would you like to delete or remove these  {total, plural, one {# Batch} other {# Batches}} {entity}"
              values={{
                entity: <Icon icon="BATCH" />,
                total: totalBatches,
              }}
            />
          </h3>
        )}
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <BaseButton
            label={<FormattedMessage id="components.button.delete" defaultMessage="DELETE" />}
            disabled={Boolean(isProcessing) || !allowToDeleteBatches}
            onClick={() => onConfirm('delete')}
          />
          <BaseButton
            label={
              <FormattedMessage
                id="components.button.removeLocally"
                defaultMessage="REMOVE LOCALLY"
              />
            }
            disabled={Boolean(isProcessing) || !allowToUpdateBatches}
            onClick={() => onConfirm('removeLocally')}
          />
          <BaseButton
            label={<FormattedMessage id="components.button.remove" defaultMessage="REMOVE" />}
            disabled={Boolean(isProcessing) || !allowToUpdateBatches}
            onClick={() => onConfirm('remove')}
          />
        </div>
      </div>
    </Dialog>
  );
}
