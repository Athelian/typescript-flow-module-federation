// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { ORDER_ITEM, CONTAINER } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, YesButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { deleteContainerMutation, deleteOrderItemMutation } from './mutation';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: ({ orderItemIds: Array<string>, containerIds: Array<string> }) => void,
|};

// TODO: check the permission
export default function DeleteConfirm({ onSuccess }: Props) {
  const [deleteOrderItem] = useMutation(deleteOrderItemMutation);
  const [deleteContainer] = useMutation(deleteContainerMutation);
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { isProcessing, isOpen, source } = state.deleteEntities;
  const orderItemIds = targetedIds(state.targets, ORDER_ITEM);
  const containerIds = targetedIds(state.targets, CONTAINER);
  const selectedEntities = source === ORDER_ITEM ? orderItemIds.length : containerIds.length;

  const onCancel = () => {
    dispatch({
      type: 'DELETE_CLOSE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'DELETE_START',
      payload: {},
    });
    if (source === ORDER_ITEM) {
      Promise.all(
        orderItemIds.map(id =>
          deleteOrderItem({
            variables: {
              id,
            },
          })
        )
      )
        .then(() => {
          onSuccess({
            orderItemIds,
            containerIds: [],
          });
        })
        .catch(() => {
          dispatch({
            type: 'DELETE_CLOSE',
            payload: {},
          });
        });
    } else {
      Promise.all(
        containerIds.map(id =>
          deleteContainer({
            variables: {
              id,
            },
          })
        )
      )
        .then(() => {
          onSuccess({
            orderItemIds: [],
            containerIds,
          });
        })
        .catch(() => {
          dispatch({
            type: 'DELETE_CLOSE',
            payload: {},
          });
        });
    }
  };

  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      <div className={DialogStyle}>
        {isProcessing ? (
          <>
            <span>
              Deleting
              <Icon icon={source === ORDER_ITEM ? 'ORDER_ITEM' : source.toUpperCase()} />
            </span>
            <LoadingIcon />
          </>
        ) : (
          <h3 className={ConfirmMessageStyle}>
            Are you sure you want to delete {selectedEntities} {source}{' '}
            <Icon icon={source === ORDER_ITEM ? 'ORDER_ITEM' : source.toUpperCase()} /> ?
          </h3>
        )}
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <YesButton
            disabled={Boolean(isProcessing)}
            isLoading={Boolean(isProcessing)}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  );
}
