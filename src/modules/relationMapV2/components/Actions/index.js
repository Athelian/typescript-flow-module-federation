// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { PermissionsContext } from 'components/Context/Permissions';
import { Entities } from 'modules/relationMapV2/store';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import { SHIPMENT_CREATE } from 'modules/permission/constants/shipment';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import {
  targetedIds,
  findOrderIdByBatch,
  findOrderIdByOrderItem,
} from 'modules/relationMapV2/components/OrderFocus/helpers';
import ActionButton from './components/ActionButton';
import ActionSubMenu from './components/ActionSubMenu';
import ActionLabel from './components/ActionLabel';
import { ActionsWrapperStyle, LeftActionsWrapperStyle } from './style';

type Props = {
  targets: Array<string>,
};

function hasPermissionToClone(
  hasPermissions: Function,
  type: typeof ORDER | typeof ORDER_ITEM | typeof BATCH | typeof CONTAINER | typeof SHIPMENT
) {
  switch (type) {
    case ORDER:
      return hasPermissions(ORDER_CREATE);

    case ORDER_ITEM:
      return hasPermissions(ORDER_ITEMS_CREATE);

    case BATCH:
      return hasPermissions(BATCH_CREATE);

    case CONTAINER:
      return hasPermissions(CONTAINER_CREATE);

    case SHIPMENT:
      return hasPermissions(SHIPMENT_CREATE);

    default:
      return false;
  }
}

// TODO: check the permission for all actions
export default function Actions({ targets }: Props) {
  const [currentMenu, setCurrentMenu] = React.useState(null);
  const { dispatch } = React.useContext(RelationMapContext);
  const { mapping } = Entities.useContainer();
  const orderIds = targetedIds(targets, ORDER);
  const orderItemIds = targetedIds(targets, ORDER_ITEM);
  const batchIds = targetedIds(targets, BATCH);
  const containerIds = targetedIds(targets, CONTAINER);
  const shipmentIds = targetedIds(targets, SHIPMENT);
  const orderIsDisabled = orderIds.length === 0;
  const itemIsDisabled = orderItemIds.length === 0;
  const batchIsDisabled = batchIds.length === 0;
  const containerIsDisabled = containerIds.length === 0;
  const shipmentIsDisabled = shipmentIds.length === 0;
  const { hasPermissionsByOrganization } = React.useContext(PermissionsContext);
  const allowToCloneOrders = targetedIds(targets, ORDER).every(id =>
    hasPermissionToClone(
      hasPermissionsByOrganization(mapping.entities?.orders?.[id]?.ownedBy),
      ORDER
    )
  );
  const allowToCloneOrderItems = targetedIds(targets, ORDER_ITEM).every(id =>
    hasPermissionToClone(
      hasPermissionsByOrganization(mapping.entities?.orderItems?.[id]?.ownedBy),
      ORDER_ITEM
    )
  );
  const allowToCloneBatches = targetedIds(targets, BATCH).every(id =>
    hasPermissionToClone(
      hasPermissionsByOrganization(mapping.entities?.batches?.[id]?.ownedBy),
      BATCH
    )
  );

  const navigateToGTV = () => {
    const ids = [...orderIds];
    batchIds.forEach(batchId => ids.push(findOrderIdByBatch(batchId, mapping.entities)));
    orderItemIds.forEach(itemId => ids.push(findOrderIdByOrderItem(itemId, mapping.entities)));
    Object.values(mapping.entities?.batches ?? {}).forEach((batch: Object) => {
      if (
        (batch.container && containerIds.includes(batch.container)) ||
        (batch.shipment && shipmentIds.includes(batch.shipment))
      ) {
        ids.push(findOrderIdByBatch(batch.id, mapping.entities));
      }
    });
    navigate('/order/sheet', {
      state: {
        orderIds: [...new Set(ids)],
      },
    });
  };

  return (
    <>
      <div className={LeftActionsWrapperStyle}>
        <ActionButton onClick={navigateToGTV}>
          <Icon icon="TABLE" />
        </ActionButton>
        <ActionButton
          onClick={() => {
            dispatch({
              type: 'EDIT',
              payload: {
                type: 'TASKS',
                selectedId: 'tasks',
                orderIds,
                orderItemIds,
                batchIds,
                containerIds,
                shipmentIds,
              },
            });
          }}
        >
          <Icon icon="TASK" />
        </ActionButton>
      </div>
      <OutsideClickHandler
        onOutsideClick={() => setCurrentMenu(null)}
        ignoreClick={currentMenu === null}
      >
        <div className={ActionsWrapperStyle}>
          <ActionButton
            isDisabled={orderIsDisabled}
            onClick={() => {
              if (currentMenu === ORDER) setCurrentMenu(null);
              else setCurrentMenu(ORDER);
            }}
          >
            <Icon icon="ORDER" />
            <ActionSubMenu isCollapsed={currentMenu !== ORDER}>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'CLONE',
                    payload: {
                      source: ORDER,
                    },
                  });
                }}
                isDisabled={!allowToCloneOrders}
              >
                <Icon icon="CLONE" />
                <ActionLabel>CLONE</ActionLabel>
              </ActionButton>

              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'TAGS',
                    payload: {
                      source: ORDER,
                    },
                  });
                }}
              >
                <Icon icon="TAG" />
                <ActionLabel>ADD TAGS</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'STATUS',
                    payload: {
                      source: ORDER,
                    },
                  });
                }}
              >
                <Icon icon="ACTIVE" /> / <Icon icon="ARCHIVE" />
                <ActionLabel>Active/Archive</ActionLabel>
              </ActionButton>
            </ActionSubMenu>
          </ActionButton>

          <ActionButton
            isDisabled={itemIsDisabled}
            onClick={() => {
              if (currentMenu === ORDER_ITEM) setCurrentMenu(null);
              else setCurrentMenu(ORDER_ITEM);
            }}
          >
            <Icon icon="ORDER_ITEM" />
            <ActionSubMenu isCollapsed={currentMenu !== ORDER_ITEM}>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'DELETE',
                    payload: {
                      source: ORDER_ITEM,
                    },
                  });
                }}
              >
                <Icon icon="REMOVE" />
                <ActionLabel>DELETE</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'TAGS',
                    payload: {
                      source: ORDER_ITEM,
                    },
                  });
                }}
              >
                <Icon icon="TAG" />
                <ActionLabel>ADD TAGS</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'AUTO_FILL',
                    payload: {
                      source: ORDER_ITEM,
                    },
                  });
                }}
              >
                <Icon icon="QUANTITY_ADJUSTMENTS" />
                <ActionLabel>AUTOFILL</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'CLONE',
                    payload: {
                      source: ORDER_ITEM,
                    },
                  });
                }}
                isDisabled={!allowToCloneOrderItems}
              >
                <Icon icon="CLONE" />
                <ActionLabel>CLONE</ActionLabel>
              </ActionButton>
            </ActionSubMenu>
          </ActionButton>

          <ActionButton
            isDisabled={batchIsDisabled}
            onClick={() => {
              if (currentMenu === BATCH) setCurrentMenu(null);
              else setCurrentMenu(BATCH);
            }}
          >
            <Icon icon="BATCH" />
            <ActionSubMenu isCollapsed={currentMenu !== BATCH}>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'DELETE_BATCHES',
                    payload: {
                      source: BATCH,
                    },
                  });
                }}
              >
                <Icon icon="REMOVE" /> / <Icon icon="CLEAR" />
                <ActionLabel>DELETE / REMOVE</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'TAGS',
                    payload: {
                      source: BATCH,
                    },
                  });
                }}
              >
                <Icon icon="TAG" />
                <ActionLabel>ADD TAGS</ActionLabel>
              </ActionButton>
              {/* TODO: check permission to move */}
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'MOVE_BATCH',
                    payload: {},
                  });
                }}
              >
                <Icon icon="EXCHANGE" />
                <ActionLabel>MOVE</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'SPLIT',
                    payload: {
                      source: BATCH,
                    },
                  });
                }}
              >
                <Icon icon="SPLIT" />
                <ActionLabel>SPLIT</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'CLONE',
                    payload: {
                      source: BATCH,
                    },
                  });
                }}
                isDisabled={!allowToCloneBatches}
              >
                <Icon icon="CLONE" />
                <ActionLabel>CLONE</ActionLabel>
              </ActionButton>
            </ActionSubMenu>
          </ActionButton>

          <ActionButton
            isDisabled={containerIsDisabled}
            onClick={() => {
              if (currentMenu === CONTAINER) setCurrentMenu(null);
              else setCurrentMenu(CONTAINER);
            }}
          >
            <Icon icon="CONTAINER" />
            <ActionSubMenu isCollapsed={currentMenu !== CONTAINER}>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'DELETE',
                    payload: {
                      source: CONTAINER,
                    },
                  });
                }}
              >
                <Icon icon="REMOVE" />
                <ActionLabel>DELETE</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'TAGS',
                    payload: {
                      source: CONTAINER,
                    },
                  });
                }}
              >
                <Icon icon="TAG" />
                <ActionLabel>ADD TAGS</ActionLabel>
              </ActionButton>
            </ActionSubMenu>
          </ActionButton>

          <ActionButton
            isDisabled={shipmentIsDisabled}
            onClick={() => {
              if (currentMenu === SHIPMENT) setCurrentMenu(null);
              else setCurrentMenu(SHIPMENT);
            }}
          >
            <Icon icon="SHIPMENT" />
            <ActionSubMenu isCollapsed={currentMenu !== SHIPMENT}>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'TAGS',
                    payload: {
                      source: SHIPMENT,
                    },
                  });
                }}
              >
                <Icon icon="TAG" />
                <ActionLabel>ADD TAGS</ActionLabel>
              </ActionButton>
              <ActionButton
                onClick={() => {
                  dispatch({
                    type: 'STATUS',
                    payload: {
                      source: SHIPMENT,
                    },
                  });
                }}
              >
                <Icon icon="ACTIVE" /> / <Icon icon="ARCHIVE" />
                <ActionLabel>Active/Archive</ActionLabel>
              </ActionButton>
            </ActionSubMenu>
          </ActionButton>
        </div>
      </OutsideClickHandler>
    </>
  );
}
