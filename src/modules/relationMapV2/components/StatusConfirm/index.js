// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { useAllHasPermission } from 'components/Context/Permissions';
import { Entities } from 'modules/relationMapV2/store';
import { ORDER, SHIPMENT } from 'modules/relationMapV2/constants';
import { ORDER_UPDATE } from 'modules/permission/constants/order';
import { SHIPMENT_UPDATE } from 'modules/permission/constants/shipment';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, ArchiveButton, ActivateButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { parseIcon } from 'utils/entity';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { updateOrdersMutation, updateShipmentMutation } from './mutation';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: (orderIds: Array<string>) => void,
|};

export default function StatusConfirm({ onSuccess }: Props) {
  const [isArchived, setIsArchived] = React.useState(false);
  const [updateOrders] = useMutation(updateOrdersMutation);
  const [updateShipments] = useMutation(updateShipmentMutation);
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { mapping } = Entities.useContainer();
  const { isProcessing, isOpen, source } = state.status;
  const orderIds = targetedIds(state.targets, ORDER);
  const hasOrderPermissions = useAllHasPermission(
    orderIds.map(id => mapping.entities?.orders?.[id]?.ownedBy).filter(Boolean)
  );
  const shipmentIds = targetedIds(state.targets, SHIPMENT);
  const hasShipmentPermissions = useAllHasPermission(
    shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy).filter(Boolean)
  );
  const selectedEntities = source === ORDER ? orderIds.length : shipmentIds.length;

  const isDisabled = (archived: boolean) => {
    if (source === ORDER) {
      return orderIds.every(orderId => mapping.entities?.orders?.[orderId]?.archived === archived);
    }
    return shipmentIds.every(
      shipmentId => mapping.entities?.shipments?.[shipmentId]?.archived === archived
    );
  };

  const hasPermission = (permission: string | Array<string>) => {
    switch (source) {
      case ORDER:
        return hasOrderPermissions(permission);
      case SHIPMENT:
        return hasShipmentPermissions(permission);
      default:
        return false;
    }
  };

  const allowToUpdate = () => {
    switch (source) {
      case ORDER:
        return hasPermission([ORDER_UPDATE]);
      case SHIPMENT:
        return hasPermission([SHIPMENT_UPDATE]);
      default:
        return false;
    }
  };

  const noPermission = !allowToUpdate();

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

  if (noPermission) {
    return (
      <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
        <div className={DialogStyle}>
          <h3 className={ConfirmMessageStyle}>
            <FormattedMessage
              id="modules.RelationMap.status.noPermission"
              defaultMessage="At least one {source} {entity} selected does not allow you to change the status.Please reselect and try again."
              values={{
                source,
                entity: <Icon icon={parseIcon(source)} />,
              }}
            />
          </h3>
          <div className={ButtonsStyle}>
            <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      {isOpen && (
        <div className={DialogStyle}>
          {isProcessing ? (
            <>
              {isArchived ? (
                <FormattedMessage
                  id="modules.RelationMap.status.archiving"
                  defaultMessage="Archiving {selectedEntities} {source}..."
                  values={{
                    selectedEntities,
                    source: <Icon icon={source.toUpperCase()} />,
                  }}
                />
              ) : (
                <FormattedMessage
                  id="modules.RelationMap.status.activating"
                  defaultMessage="Activating {selectedEntities} {source}..."
                  values={{
                    selectedEntities,
                    source: <Icon icon={source.toUpperCase()} />,
                  }}
                />
              )}
              <LoadingIcon />
            </>
          ) : (
            <h3 className={ConfirmMessageStyle}>
              <FormattedMessage
                id="modules.RelationMap.status.guideline"
                defaultMessage="Are you sure you want to archive or activate {selectedEntities} {source} ?"
                values={{
                  selectedEntities,
                  source: <Icon icon={source.toUpperCase()} />,
                }}
              />
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
      )}
    </Dialog>
  );
}
