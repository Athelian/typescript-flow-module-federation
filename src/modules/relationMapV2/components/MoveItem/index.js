// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds, findOrderIdByItem } from 'modules/relationMapV2/helpers';
import { ORDER_ITEM } from 'modules/relationMapV2/constants';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import { BaseButton } from 'components/Buttons';
import { useAllHasPermission } from 'contexts/Permissions';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
import ActionDialog, { OrderLabelIcon, ItemLabelIcon, ItemsLabelIcon } from '../ActionDialog';
import SelectOrderToMove from '../MoveBatch/components/SelectOrderToMove';
import {
  ItemMoveButtonsWrapperStyle,
  MoveWrapperStyle,
  TitleDescriptionWrapperStyle,
  DescriptionStyle,
} from './style';

type Props = {
  onSuccess: (orderIds: Array<string>) => void,
};

export default function MoveItem({ onSuccess }: Props) {
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = FocusedView.useContainer();
  const itemIds = targetedIds(state.targets, ORDER_ITEM);
  const orderIds = itemIds
    .map(orderItemId =>
      findOrderIdByItem({
        orderItemId,
        viewer: state.viewer,
        entities: mapping.entities,
      })
    )
    .filter(Boolean);
  const totalItems = itemIds.length;
  const { isProcessing, isOpen, type } = state.itemActions;
  const isMoveItems = type === 'moveItems';

  const onCancel = () => {
    dispatch({
      type: 'MOVE_ITEM_CLOSE',
      payload: {},
    });
  };

  const hasPermissions = useAllHasPermission(
    itemIds.map(orderItemId => mapping.entities?.orderItems?.[orderItemId]?.ownedBy).filter(Boolean)
  );

  const importerIds = [];
  const exporterIds = [];
  orderIds.forEach(orderId => {
    const order = mapping.entities?.orders?.[orderId];
    const importId = order?.importer?.id;
    const exporterId = order?.exporter?.id;
    if (importId && !importerIds.includes(importId)) {
      importerIds.push(importId);
    }
    if (exporterId && !exporterIds.includes(exporterId)) {
      exporterIds.push(exporterId);
    }
  });

  const onConfirm = (target: 'existOrder' | 'newOrder') => {
    switch (target) {
      case 'newOrder':
        dispatch({
          type: 'MOVE_ITEM_TO_NEW_ENTITY',
          payload: {
            type: 'MOVE_ITEMS',
            selectedId: target,
            itemIds,
            orderIds,
            importerIds,
            exporterIds,
          },
        });
        break;

      default:
        dispatch({
          type: 'MOVE_ITEM_START',
          payload: {
            type: target,
            itemIds,
            orderIds,
            importerIds,
            exporterIds,
          },
        });
    }
  };

  const isSamePartners = () => {
    return importerIds.length <= 1 && exporterIds.length <= 1;
  };

  const hasPermissionMoveToExistOrder = () => {
    return isSamePartners() && hasPermissions(ORDER_ITEMS_UPDATE);
  };

  const hasPermissionMoveToNewOrder = () => {
    return isSamePartners() && hasPermissions(ORDER_CREATE) && hasPermissions(ORDER_ITEMS_UPDATE);
  };

  const noPermission = !hasPermissionMoveToExistOrder() && !hasPermissionMoveToNewOrder();

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (noPermission) {
    // No permission to move anywhere
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.moveItem.noPermission"
        defaultMessage="At least one {itemLabel} selected does not allow you to move it anywhere"
        values={{ itemLabel: <ItemLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else if (isProcessing) {
    // Is currently moving
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.moving"
        defaultMessage="Moving {numOfItems} {itemsLabel} ..."
        values={{
          numOfItems: <FormattedNumber value={totalItems} />,
          itemsLabel: totalItems > 1 ? <ItemsLabelIcon /> : <ItemLabelIcon />,
        }}
      />
    );
  } else {
    // Has permission to move
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.moveItem.message1"
        defaultMessage="Where would you like to move the {numOfItems} {itemsLabel} that you have selected?"
        values={{
          numOfItems: <FormattedNumber value={totalItems} />,
          itemsLabel: totalItems > 1 ? <ItemsLabelIcon /> : <ItemLabelIcon />,
        }}
      />
    );
  }

  return (
    <>
      <ActionDialog
        isOpen={isOpen && isMoveItems}
        isProcessing={isProcessing}
        onCancel={onCancel}
        title={<FormattedMessage id="modules.RelationMap.label.move" defaultMessage="MOVE" />}
        dialogMessage={dialogMessage}
        dialogSubMessage={dialogSubMessage}
      >
        <div className={ItemMoveButtonsWrapperStyle}>
          <div className={MoveWrapperStyle}>
            <div className={TitleDescriptionWrapperStyle}>
              <Label height="30px">
                <FormattedMessage
                  id="modules.RelationMap.move.moveToOrder"
                  defaultMessage="Move to Order"
                />
              </Label>
              <div className={DescriptionStyle}>
                <FormattedMessage
                  id="modules.RelationMap.moveItem.moveToOrderDescription"
                  defaultMessage="Move {itemsLabel} to an existing {orderLabel}"
                  values={{
                    orderLabel: <OrderLabelIcon />,
                    itemsLabel: <ItemsLabelIcon />,
                  }}
                />
              </div>
            </div>

            {!hasPermissionMoveToExistOrder() ? (
              <Tooltip
                message={
                  !isSamePartners() ? (
                    <FormattedMessage
                      id="modules.RelationMap.moveItem.moveToOrderSamePartnersTooltip"
                      defaultMessage="At least one selected Item has a different Importer or Exporter from the others. You can only move Items to a different Order if they all have the same Importer and Exporter."
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.RelationMap.moveItem.noPermissionTooltip"
                      defaultMessage="At least one selected Item does not give you permission to move it."
                    />
                  )
                }
              >
                <div>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.RelationMap.label.moveTo"
                        defaultMessage="MOVE TO"
                      />
                    }
                    icon="ORDER"
                    disabled
                  />
                </div>
              </Tooltip>
            ) : (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.RelationMap.label.moveTo"
                    defaultMessage="MOVE TO"
                  />
                }
                icon="ORDER"
                onClick={() => onConfirm('existOrder')}
              />
            )}
          </div>

          <div className={MoveWrapperStyle}>
            <div className={TitleDescriptionWrapperStyle}>
              <Label height="30px">
                <FormattedMessage
                  id="modules.RelationMap.move.moveToNewOrder"
                  defaultMessage="Move to New Order"
                />
              </Label>
              <div className={DescriptionStyle}>
                <FormattedMessage
                  id="modules.RelationMap.moveItem.moveToNewOrderDescription"
                  defaultMessage="Move {itemsLabel} to a new {orderLabel}"
                  values={{
                    orderLabel: <OrderLabelIcon />,
                    itemsLabel: <ItemsLabelIcon />,
                  }}
                />
              </div>
            </div>
            {!hasPermissionMoveToNewOrder() ? (
              <Tooltip
                message={
                  !isSamePartners() ? (
                    <FormattedMessage
                      id="modules.RelationMap.moveItem.moveToOrderSamePartnersTooltip"
                      defaultMessage="At least one selected Item has a different Importer or Exporter from the others. You can only move Items to a different Order if they all have the same Importer and Exporter."
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.RelationMap.moveItem.noPermissionTooltip"
                      defaultMessage="At least one selected Item does not give you permission to move it."
                    />
                  )
                }
              >
                <div>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.RelationMap.label.moveToNew"
                        defaultMessage="MOVE TO NEW"
                      />
                    }
                    icon="ORDER"
                    disabled
                  />
                </div>
              </Tooltip>
            ) : (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.RelationMap.label.moveToNew"
                    defaultMessage="MOVE TO NEW"
                  />
                }
                icon="ORDER"
                onClick={() => onConfirm('newOrder')}
              />
            )}
          </div>
        </div>
      </ActionDialog>

      <SelectOrderToMove onSuccess={onSuccess} />
    </>
  );
}
