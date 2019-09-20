// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, YesButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { removeBatchMutation } from './mutation';

type Props = {|
  onSuccess: (batchId: string) => void,
|};

export default function RemoveBatchConfirm({ onSuccess }: Props) {
  const [removeBatch] = useMutation(removeBatchMutation);
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = React.useContext(RelationMapContext);
  const {
    isProcessing,
    isOpen,
    type,
    detail: { entity, from },
  } = state.batchActions;
  const batch = mapping.entities?.batches?.[entity.id] ?? {};
  const container = mapping.entities?.containers?.[batch?.container];
  const shipment = mapping.entities?.shipments?.[batch?.shipment];
  const fromIdentifier = container?.no ?? shipment?.no;
  const isRemoveBatch = type === 'removeBatch';
  const onCancel = () => {
    dispatch({
      type: 'REMOVE_BATCH_CLOSE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'REMOVE_BATCH_START',
      payload: {},
    });
    removeBatch({
      variables: {
        id: entity.id,
        input: container
          ? {
              containerId: null,
            }
          : {
              shipmentId: null,
            },
      },
    })
      .then(() => {
        onSuccess(entity.id);
      })
      .catch(() => {
        dispatch({
          type: 'REMOVE_BATCH_CLOSE',
          payload: {},
        });
      });
  };

  return (
    <Dialog isOpen={isOpen && isRemoveBatch} width="400px" onRequestClose={() => {}}>
      {isOpen && isRemoveBatch && (
        <div className={DialogStyle}>
          {isProcessing ? (
            <>
              <span>
                Removing Batch
                <Icon icon="BATCH" />
                {` ${entity.no}...`}
                from <Icon icon={from?.type ?? 'CONTAINER'} />
                {` ${fromIdentifier}...`}
              </span>
              <LoadingIcon />
            </>
          ) : (
            <h3 className={ConfirmMessageStyle}>
              Are you sure you want to remove <Icon icon="BATCH" /> {` ${entity.no} from`}{' '}
              <Icon icon={from?.type ?? 'CONTAINER'} />
              {` ${fromIdentifier}?`}
            </h3>
          )}
          <div className={ButtonsStyle}>
            <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
            <YesButton disabled={Boolean(isProcessing)} onClick={onConfirm} />
          </div>
        </div>
      )}
    </Dialog>
  );
}
