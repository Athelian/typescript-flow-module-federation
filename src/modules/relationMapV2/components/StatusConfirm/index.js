// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import { ORDER, SHIPMENT } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, ArchiveButton, ActivateButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { updateOrdersMutation, updateShipmentMutation } from './mutation';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: (orderIds: Array<string>) => void,
|};

// TODO: check the permission
export default function StatusConfirm({ onSuccess }: Props) {
  const [isArchived, setIsArchived] = React.useState(false);
  const [updateOrders] = useMutation(updateOrdersMutation);
  const [updateShipments] = useMutation(updateShipmentMutation);
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { mapping } = Entities.useContainer();
  const { isProcessing, isOpen, source } = state.status;
  const orderIds = targetedIds(state.targets, ORDER);
  const shipmentIds = targetedIds(state.targets, SHIPMENT);
  const selectedEntities = source === ORDER ? orderIds.length : shipmentIds.length;

  const isDisabled = (archived: boolean) => {
    if (source === ORDER) {
      return orderIds.every(orderId => mapping.entities?.orders?.[orderId]?.archived === archived);
    }
    return shipmentIds.every(
      shipmentId => mapping.entities?.shipments?.[shipmentId]?.archived === archived
    );
  };

  const onCancel = () => {
    dispatch({
      type: 'STATUS_CLOSE',
      payload: {},
    });
  };
  const onConfirm = archived => {
    setIsArchived(archived);
    dispatch({
      type: 'STATUS_START',
      payload: {},
    });
    if (source === ORDER) {
      updateOrders({
        variables: {
          orders: orderIds.map(id => ({
            id,
            input: {
              archived,
            },
          })),
        },
      })
        .then(() => {
          onSuccess(orderIds);
        })
        .catch(() => {
          dispatch({
            type: 'STATUS_CLOSE',
            payload: {},
          });
        });
    } else {
      updateShipments({
        variables: {
          shipments: shipmentIds.map(id => ({
            id,
            input: {
              archived,
            },
          })),
        },
      })
        .then(result => {
          const ids = [];
          (result.data?.shipmentUpdateMany ?? []).forEach(shipment => {
            (shipment?.batches ?? []).forEach(batch => {
              if (!ids.includes(batch?.orderItem?.order?.id)) ids.push(batch?.orderItem?.order?.id);
            });
          });
          onSuccess(ids);
        })
        .catch(() => {
          dispatch({
            type: 'STATUS_CLOSE',
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
              {isArchived ? 'Archiving' : 'Activating'}
              <Icon icon={source.toUpperCase()} />
            </span>
            <LoadingIcon />
          </>
        ) : (
          <h3 className={ConfirmMessageStyle}>
            Are you sure you want to archive or activate {selectedEntities} {source}{' '}
            <Icon icon={source.toUpperCase()} /> ?
          </h3>
        )}
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <ArchiveButton
            disabled={Boolean(isProcessing) || isDisabled(true)}
            onClick={() => onConfirm(true)}
          />
          <ActivateButton
            disabled={Boolean(isProcessing) || isDisabled(false)}
            onClick={() => onConfirm(false)}
          />
        </div>
      </div>
    </Dialog>
  );
}
