// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import logger from 'utils/logger';
import { PermissionsContext } from 'components/Context/Permissions';
import { Entities } from 'modules/relationMapV2/store';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import { SHIPMENT_CREATE } from 'modules/permission/constants/shipment';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { targetedIds } from 'modules/relationMapV2/components/OrderFocus/helpers';
import ActionButton from './components/ActionButton';
import ActionSubMenu from './components/ActionSubMenu';
import ActionLabel from './components/ActionLabel';
import { ActionsWrapperStyle } from './style';

type Props = {
  targets: Array<string>,
};

function getEntityCount(targets: Array<string>, entityConstant: string) {
  return targets.filter(item => item.includes(`${entityConstant}-`)).length;
}

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

export default function Actions({ targets }: Props) {
  const [currentMenu, setCurrentMenu] = React.useState(null);
  const { dispatch } = React.useContext(RelationMapContext);
  const { mapping } = Entities.useContainer();
  const orderIsDisabled = getEntityCount(targets, ORDER) === 0;
  const itemIsDisabled = getEntityCount(targets, ORDER_ITEM) === 0;
  const batchIsDisabled = getEntityCount(targets, BATCH) === 0;
  const containerIsDisabled = getEntityCount(targets, CONTAINER) === 0;
  const shipmentIsDisabled = getEntityCount(targets, SHIPMENT) === 0;
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

  return (
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
                logger.warn('CLONE');
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

            <ActionButton onClick={() => logger.warn('ADD TAGS')}>
              <Icon icon="TAG" />
              <ActionLabel>ADD TAGS</ActionLabel>
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
                logger.warn('CLONE');
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

            <ActionButton onClick={() => logger.warn('ADD TAGS')}>
              <Icon icon="TAG" />
              <ActionLabel>ADD TAGS</ActionLabel>
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
            {/* TODO: check permission to move */}
            <ActionButton
              onClick={() => {
                logger.warn('MOVE');
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
                logger.warn('CLONE');
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

            <ActionButton onClick={() => logger.warn('ADD TAGS')}>
              <Icon icon="TAG" />
              <ActionLabel>ADD TAGS</ActionLabel>
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
        </ActionButton>

        <ActionButton
          isDisabled={shipmentIsDisabled}
          onClick={() => {
            if (currentMenu === SHIPMENT) setCurrentMenu(null);
            else setCurrentMenu(SHIPMENT);
          }}
        >
          <Icon icon="SHIPMENT" />
        </ActionButton>
      </div>
    </OutsideClickHandler>
  );
}
