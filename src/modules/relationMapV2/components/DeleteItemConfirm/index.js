// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, YesButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { deleteOrderItemMutation } from './mutation';

type Props = {|
  onSuccess: (itemId: string) => void,
|};

export default function DeleteItemConfirm({ onSuccess }: Props) {
  const [deleteItem] = useMutation(deleteOrderItemMutation);
  const { dispatch, state } = React.useContext(RelationMapContext);
  const {
    isProcessing,
    isOpen,
    type,
    detail: { entity },
  } = state.itemActions;
  const isDeleteItem = type === 'deleteItem';
  const onCancel = () => {
    dispatch({
      type: 'DELETE_ITEM_CLOSE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'DELETE_ITEM_START',
      payload: {},
    });
    deleteItem({
      variables: {
        id: entity.id,
      },
    })
      .then(() => {
        onSuccess(entity.id);
      })
      .catch(() => {
        dispatch({
          type: 'DELETE_ITEM_CLOSE',
          payload: {},
        });
      });
  };
  return (
    <Dialog isOpen={isOpen && isDeleteItem} width="400px" onRequestClose={() => {}}>
      <div className={DialogStyle}>
        {isProcessing ? (
          <>
            <span>
              Deleting
              <Icon icon="ORDER_ITEM" />
              {` ${entity.no}...`}
            </span>
            <LoadingIcon />
          </>
        ) : (
          <h3 className={ConfirmMessageStyle}>
            Are you sure you want to delete <Icon icon="ORDER_ITEM" /> {` ${entity.no} ?`} All of
            its Batches will be deleted as well
          </h3>
        )}
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <YesButton disabled={Boolean(isProcessing)} onClick={onConfirm} />
        </div>
      </div>
    </Dialog>
  );
}
