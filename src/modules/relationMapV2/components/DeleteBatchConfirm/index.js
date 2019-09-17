// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, YesButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { deleteBatchMutation } from './mutation';

type Props = {|
  onSuccess: (batchId: string) => void,
|};

export default function DeleteBatchConfirm({ onSuccess }: Props) {
  const [deleteItem] = useMutation(deleteBatchMutation);
  const { dispatch, state } = React.useContext(RelationMapContext);
  const {
    isProcessing,
    isOpen,
    type,
    detail: { entity },
  } = state.batchActions;
  const isDeleteItem = type === 'deleteBatch';
  const onCancel = () => {
    dispatch({
      type: 'DELETE_BATCH_CLOSE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'DELETE_BATCH_START',
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
          type: 'DELETE_BATCH_CLOSE',
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
              <Icon icon="BATCH" />
              {` ${entity.no}...`}
            </span>
            <LoadingIcon />
          </>
        ) : (
          <h3 className={ConfirmMessageStyle}>
            Are you sure you want to delete <Icon icon="BATCH" /> {` ${entity.no} ?`}
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
