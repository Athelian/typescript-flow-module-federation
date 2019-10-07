// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';

import { useAllHasPermission } from 'components/Context/Permissions';
import { Entities, OrderFocused } from 'modules/relationMapV2/store';
import { ORDER, SHIPMENT } from 'modules/relationMapV2/constants';
import { ORDER_UPDATE } from 'modules/permission/constants/order';
import { SHIPMENT_UPDATE } from 'modules/permission/constants/shipment';
import { ArchiveButton, ActivateButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import { Tooltip } from 'components/Tooltip';
import ActionDialog, {
  OrdersLabelIcon,
  OrderLabelIcon,
  ShipmentLabelIcon,
  ShipmentsLabelIcon,
} from '../ActionDialog';
import { updateOrdersMutation, updateShipmentMutation } from './mutation';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: (orderIds: Array<string>) => void,
|};

export default function StatusConfirm({ onSuccess }: Props) {
  const [isArchived, setIsArchived] = React.useState(false);
  const [updateOrders] = useMutation(updateOrdersMutation);
  const [updateShipments] = useMutation(updateShipmentMutation);
  const { dispatch, state } = OrderFocused.useContainer();
  const { mapping } = Entities.useContainer();
  const { isProcessing, isOpen, source } = state.status;
  const orderIds = targetedIds(state.targets, ORDER);
  const hasOrderPermissions = useAllHasPermission(
    orderIds.map(id => mapping.entities?.orders?.[id]?.ownedBy).filter(Boolean)
  );
  const totalOrders = orderIds.length;
  const shipmentIds = targetedIds(state.targets, SHIPMENT);
  const hasShipmentPermissions = useAllHasPermission(
    shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy).filter(Boolean)
  );
  const totalShipments = shipmentIds.length;

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

  const noPermission = !allowToUpdate();

  let dialogMessage = null;
  let dialogSubMessage = null;
  let entityLabel = null;
  let numOfEntity = null;

  if (noPermission) {
    // No permission to change status
    switch (source) {
      case ORDER:
        entityLabel = <OrderLabelIcon />;
        break;
      case SHIPMENT:
        entityLabel = <ShipmentLabelIcon />;
        break;
      default:
        break;
    }
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.activateArchive.noPermission"
        defaultMessage="At least one {entityLabel} selected does not allow you to change status."
        values={{ entityLabel }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else {
    switch (source) {
      case ORDER:
        numOfEntity = <FormattedNumber value={totalOrders} />;
        entityLabel = totalOrders > 1 ? <OrdersLabelIcon /> : <OrderLabelIcon />;
        break;
      case SHIPMENT:
        numOfEntity = <FormattedNumber value={totalShipments} />;
        entityLabel = totalShipments > 1 ? <ShipmentsLabelIcon /> : <ShipmentLabelIcon />;
        break;
      default:
        break;
    }
    if (isProcessing) {
      // Is currently changing status
      dialogMessage = isArchived ? (
        <FormattedMessage
          id="modules.RelationMap.activateArchive.archiving"
          defaultMessage="Archiving {numOfEntity} {entityLabel} ..."
          values={{
            numOfEntity,
            entityLabel,
          }}
        />
      ) : (
        <FormattedMessage
          id="modules.RelationMap.activateArchive.activating"
          defaultMessage="Activating {numOfEntity} {entityLabel} ..."
          values={{
            numOfEntity,
            entityLabel,
          }}
        />
      );
    } else {
      // Has permission to change status
      dialogMessage = (
        <FormattedMessage
          id="modules.RelationMap.activateArchive.message1"
          defaultMessage="Are you sure you want to activate or archive {numOfEntity} {entityLabel} that you have selected?"
          values={{
            numOfEntity,
            entityLabel,
          }}
        />
      );
    }
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={
        <FormattedMessage
          id="modules.RelationMap.label.activateArchive"
          defaultMessage="ACTIVATE/ARCHIVE"
        />
      }
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <>
          {noPermission || isDisabled(false) ? (
            <>
              {noPermission ? (
                <ActivateButton disabled />
              ) : (
                <Tooltip
                  message={
                    <FormattedMessage
                      id="modules.RelationMap.activateArchive.disabledActivate"
                      defaultMessage="Entire selection already has Active statuses"
                    />
                  }
                >
                  <div>
                    <ActivateButton disabled />
                  </div>
                </Tooltip>
              )}
            </>
          ) : (
            <ActivateButton onClick={() => onConfirm(false)} />
          )}

          {noPermission || isDisabled(true) ? (
            <>
              {noPermission ? (
                <ArchiveButton disabled />
              ) : (
                <Tooltip
                  message={
                    <FormattedMessage
                      id="modules.RelationMap.activateArchive.disabledArchive"
                      defaultMessage="Entire selection already has Archived statuses"
                    />
                  }
                >
                  <div>
                    <ArchiveButton disabled />
                  </div>
                </Tooltip>
              )}
            </>
          ) : (
            <ArchiveButton onClick={() => onConfirm(true)} />
          )}
        </>
      }
    />
  );
}
