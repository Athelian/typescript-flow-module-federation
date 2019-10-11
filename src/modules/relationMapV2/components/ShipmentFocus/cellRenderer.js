/* eslint-disable react/no-unused-prop-types */
// @flow
import * as React from 'react';
import type { OrderPayload, ShipmentPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { useDrop, useDrag } from 'react-dnd';
import { uuid } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import { useEntityHasPermissions, useHasPermissions } from 'contexts/Permissions';
import { Tooltip } from 'components/Tooltip';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import BaseCard from 'components/Cards';
import {
  ORDER,
  ORDER_ITEM,
  BATCH,
  CONTAINER,
  SHIPMENT,
  PRODUCT,
  TAG,
  ORDER_WIDTH,
  BATCH_WIDTH,
  ORDER_ITEM_WIDTH,
  CONTAINER_WIDTH,
  SHIPMENT_WIDTH,
} from 'modules/relationMapV2/constants';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { CONTAINER_BATCHES_ADD } from 'modules/permission/constants/container';
import { SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH } from 'modules/permission/constants/shipment';
import { Hits, Entities, ClientSorts, FocusedView } from 'modules/relationMapV2/store';
import {
  getColorByEntity,
  getIconByEntity,
  handleClickAndDoubleClick,
  findOrderIdByBatch,
  findItemIdByBatch,
} from 'modules/relationMapV2/helpers';
import Badge from 'modules/relationMapV2/components/Badge';
import type { CellRender } from 'modules/relationMapV2/type.js.flow';
import type { LINE_CONNECTOR } from '../RelationLine';
import RemoveButton from '../RemoveButton';
import RelationLine from '../RelationLine';
import FilterHitBorder from '../FilterHitBorder';
import CellWrapper from '../CellWrapper';
import OrderCard from '../OrderCard';
import OrderItemCard from '../OrderItemCard';
import BatchCard from '../BatchCard';
import ContainerCard from '../ContainerCard';
import ShipmentCard from '../ShipmentCard';
import OrderItemHeading from '../OrderItemHeading';
import BatchHeading from '../BatchHeading';
import ContainerHeading from '../ContainerHeading';
import OrderHeading from '../OrderHeading';
import { ContentStyle } from './style';

type CellProps = {
  data: Object,
  beforeConnector?: ?LINE_CONNECTOR,
  afterConnector?: ?LINE_CONNECTOR,
};

function isMatchedEntity(matches: Object, data: Object) {
  if (!matches?.entity || !data) return false;

  if (data.__typename === ORDER_ITEM) {
    return matches?.entity[`${data.productProvider?.product?.id}-${PRODUCT}`];
  }

  if (data.__typename === ORDER) {
    return (
      matches?.entity[`${data.id}-${data.__typename}`] ||
      (data?.tags ?? []).some(tag => matches?.entity[`${tag?.id}-${TAG}`])
    );
  }

  return matches?.entity[`${data.id}-${data.__typename}`];
}

export const Overlay = ({
  color,
  message,
  icon,
}: {
  color: string,
  message?: React$Node,
  icon?: React$Node,
}) => {
  return message ? (
    <Tooltip visible message={message}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 4,
          backgroundColor: color,
          borderRadius: '5px',
        }}
      >
        {icon && (
          <div
            style={{
              position: 'absolute',
              width: '55px',
              height: '55px',
              right: '0px',
              top: '0px',
              fontSize: '48px',
              lineHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#fff',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Tooltip>
  ) : (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 4,
        backgroundColor: color,
        borderRadius: '5px',
      }}
    >
      {icon && (
        <div
          style={{
            position: 'absolute',
            width: '55px',
            height: '55px',
            right: '0px',
            top: '0px',
            fontSize: '48px',
            lineHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color,
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

const getIdentifier = ({
  id,
  type,
  entities,
}: {
  id: string,
  type: typeof ORDER | typeof BATCH | typeof ORDER_ITEM | typeof CONTAINER | typeof SHIPMENT,
  entities: Object,
}) => {
  switch (type) {
    case ORDER:
      return {
        id,
        icon: 'ORDER',
        value: getByPathWithDefault('', `orders.${id}.poNo`, entities),
      };
    case ORDER_ITEM:
      return {
        id,
        icon: 'ORDER_ITEM',
        value: getByPathWithDefault('', `orderItems.${id}.no`, entities),
      };
    case BATCH:
      return {
        id,
        icon: 'BATCH',
        value: getByPathWithDefault('', `batches.${id}.no`, entities),
      };
    case CONTAINER:
      return {
        id,
        icon: 'CONTAINER',
        value: getByPathWithDefault('', `containers.${id}.no`, entities),
      };
    case SHIPMENT:
      return {
        id,
        icon: 'SHIPMENT',
        value: getByPathWithDefault('', `shipments.${id}.blNo`, entities),
      };

    default:
      return {
        id,
        icon: 'ORDER',
        value: '',
      };
  }
};

// NOTE: only support for drag and drop a batch
const hasPermissionToMove = ({
  type,
  hasPermissions,
}: {|
  hasPermissions: (Array<string> | string) => boolean,
  type: typeof ORDER | typeof ORDER_ITEM | typeof BATCH | typeof CONTAINER | typeof SHIPMENT,
|}) => {
  switch (type) {
    case BATCH: {
      // move a batch to order item or order
      return hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
    }

    case SHIPMENT: {
      return hasPermissions([CONTAINER_BATCHES_ADD, SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH]);
    }

    default:
      return true;
  }
};

const orderDropMessage = ({
  orderId,
  entities,
  hasPermissions,
  item,
}: {|
  entities: Object,
  hasPermissions: Function,
  orderId: string,
  item: ?{
    type: string,
    id: string,
  },
|}) => {
  const type = item?.type ?? '';
  switch (type) {
    case BATCH: {
      const batchId = item?.id ?? '';
      const parentOrderId = findOrderIdByBatch(batchId, entities);
      if (!parentOrderId) return '';

      const isOwnOrder = orderId === parentOrderId;
      if (isOwnOrder)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (<FormattedMessage id="modules.RelationMap.dnd.sameOrder" defaultMessage="SAME ORDER" />
            )
          </div>
        );

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', entities.orders[orderId]) !==
        getByPathWithDefault('', 'importer.id', entities.orders[parentOrderId]);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        getByPathWithDefault('', 'exporter.id', entities.orders[orderId]) !==
        getByPathWithDefault('', 'exporter.id', entities.orders[parentOrderId]);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({
        hasPermissions,
        type: BATCH,
      });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveToOrder"
            defaultMessage="MOVE TO ORDER"
          />
          <br />
          (
          <FormattedMessage
            id="modules.RelationMap.dnd.itemGenerated"
            defaultMessage="ITEM WILL BE GENERATED"
          />
          )
        </div>
      );
    }

    default:
      return '';
  }
};

const orderItemDropMessage = ({
  itemId,
  hasPermissions,
  order,
  entities,
  item,
}: {|
  entities: Object,
  hasPermissions: Function,
  itemId: string,
  order: OrderPayload,
  item: {
    type: string,
    id: string,
  },
|}) => {
  const type = item?.type ?? '';
  switch (type) {
    case BATCH: {
      const batchId = item && item.id;
      const parentOrderId = findOrderIdByBatch(batchId, entities);
      if (!parentOrderId) return '';

      const parentItemId = findItemIdByBatch(batchId, entities);
      if (!parentItemId) return '';

      const isOwnItem = parentItemId === itemId;
      if (isOwnItem)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noItemPermission"
              defaultMessage="CANNOT MOVE TO ITEM"
            />{' '}
            <br />
            (<FormattedMessage id="modules.RelationMap.dnd.sameItem" defaultMessage="SAME ITEM" />)
          </div>
        );

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', order) !==
        getByPathWithDefault('', 'importer.id', entities.orders[parentOrderId]);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noItemPermission"
              defaultMessage="CANNOT MOVE TO ITEM"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        getByPathWithDefault('', 'exporter.id', order) !==
        getByPathWithDefault('', 'exporter.id', entities.orders[parentOrderId]);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noItemPermission"
              defaultMessage="CANNOT MOVE TO ITEM"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({
        hasPermissions,
        type: BATCH,
      });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noItemPermission"
              defaultMessage="CANNOT MOVE TO ITEM"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage id="modules.RelationMap.dnd.moveItem" defaultMessage="MOVE TO ITEM" />
        </div>
      );
    }

    default:
      return '';
  }
};

const containerDropMessage = ({
  containerId,
  entities,
  item,
  hasPermissions,
}: {|
  hasPermissions: Function,
  entities: Object,
  containerId: string,
  item: ?{
    type: string,
    id: string,
  },
|}) => {
  const type = item?.type ?? '';
  switch (type) {
    case BATCH: {
      const batchId = item?.id ?? '';
      const parentOrderId = findOrderIdByBatch(batchId, entities);
      if (!parentOrderId) return '';
      const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
      const isOwnContainer = batch.container === containerId;
      if (isOwnContainer)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noContainerPermission"
              defaultMessage="CANNOT MOVE TO CONTAINER"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.sameContainer"
              defaultMessage="SAME CONTAINER"
            />
            )
          </div>
        );

      const container = getByPathWithDefault({}, `containers.${containerId}`, entities);
      const shipment = getByPathWithDefault({}, `shipments.${container.shipment}`, entities);
      const order = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', shipment) !==
        getByPathWithDefault('', 'importer.id', order);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noContainerPermission"
              defaultMessage="CANNOT MOVE TO CONTAINER"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        shipment.exporter &&
        getByPathWithDefault('', 'exporter.id', shipment) !==
          getByPathWithDefault('', 'exporter.id', order);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noContainerPermission"
              defaultMessage="CANNOT MOVE TO CONTAINER"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({ hasPermissions, type: SHIPMENT });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noContainerPermission"
              defaultMessage="CANNOT MOVE TO CONTAINER"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveContainer"
            defaultMessage="MOVE TO CONTAINER"
          />
        </div>
      );
    }

    default:
      return '';
  }
};

const shipmentDropMessage = ({
  shipmentId,
  entities,
  item,
  hasPermissions,
}: {|
  hasPermissions: Function,
  entities: Object,
  shipmentId: string,
  item: ?{
    type: string,
    id: string,
  },
|}) => {
  const type = item?.type ?? '';
  switch (type) {
    case BATCH: {
      const batchId = item?.id ?? '';
      const parentOrderId = findOrderIdByBatch(batchId, entities);
      if (!parentOrderId) return '';
      const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
      const isOwnShipment = batch.shipment === shipmentId;
      if (isOwnShipment)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.sameShipment"
              defaultMessage="SAME SHIPMENT"
            />
            )
          </div>
        );

      const shipment = getByPathWithDefault({}, `shipments.${shipmentId}`, entities);
      const order = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', shipment) !==
        getByPathWithDefault('', 'importer.id', order);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        shipment.exporter &&
        getByPathWithDefault('', 'exporter.id', shipment) !==
          getByPathWithDefault('', 'exporter.id', order);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({ hasPermissions, type: SHIPMENT });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveShipment"
            defaultMessage="MOVE TO SHIPMENT"
          />
        </div>
      );
    }

    default:
      return '';
  }
};

function OrderCell({ data, beforeConnector }: CellProps) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const hasPermissions = useEntityHasPermissions(data);
  const orderId = data.orderItem?.order?.id;
  const itemId = data.orderItem?.id;
  const order = data.orderItem?.order;
  const [{ isOver, canDrop, dropMessage, isSameItem }, drop] = useDrop({
    accept: [BATCH, ORDER_ITEM],
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const parentOrderId = findOrderIdByBatch(batchId, entities);
          if (!parentOrderId) return false;
          const isOwnOrder = orderId === parentOrderId;
          const isDifferentImporter =
            getByPathWithDefault('', 'importer.id', entities.orders[orderId]) !==
            getByPathWithDefault('', 'importer.id', entities.orders[parentOrderId]);
          const isDifferentExporter =
            getByPathWithDefault('', 'exporter.id', entities.orders[orderId]) !==
            getByPathWithDefault('', 'exporter.id', entities.orders[parentOrderId]);
          const noPermission = !hasPermissionToMove({
            hasPermissions,
            type,
          });
          return !isOwnOrder && !isDifferentImporter && !isDifferentExporter && !noPermission;
        }

        default:
          return false;
      }
    },
    drop: () => ({ type: ORDER, id: orderId }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isSameItem: monitor.getItem() && monitor.getItem().id === orderId,
      dropMessage: orderDropMessage({
        hasPermissions,
        entities,
        orderId,
        item: monitor.getItem(),
      }),
    }),
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: ORDER, id: orderId },
    canDrag: () => false,
    begin: () => {
      dispatch({
        type: 'START_DND',
      });
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        dispatch({
          type: 'DND',
          payload: { item, dropResult },
        });
      }
      dispatch({
        type: 'END_DND',
      });
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const entity = `${ORDER}-${orderId}`;
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity,
      },
    });
  };
  const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
  const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${itemId}`);
  const isTargeted = isTargetedOrder && isTargetedItem;
  const hasRelation = isTargetedItem;
  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTarget,
    onCtrlClick: () =>
      dispatch({
        type: 'EDIT',
        payload: {
          type: ORDER,
          selectedId: orderId,
        },
      }),
  });
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine isTargeted={isTargeted} hasRelation={hasRelation} type={beforeConnector} />
        )}
      </div>

      <CellWrapper ref={drop}>
        {isDragging ? (
          <div
            style={{
              background: '#AAAAAA',
              width: ORDER_WIDTH - 20,
              height: '100%',
              borderRadius: '5px',
            }}
          />
        ) : (
          <BaseCard
            icon="ORDER"
            color="ORDER"
            isArchived={getByPathWithDefault(false, 'archived', order)}
            selected={state.targets.includes(`${ORDER}-${orderId}`)}
            selectable={state.targets.includes(`${ORDER}-${orderId}`)}
            onClick={handleClick}
            flattenCornerIcon
          >
            <div ref={drag} id={`${ORDER}-${orderId}`}>
              <Badge label={badge.order?.[orderId] || ''} />
              <OrderCard
                organizationId={order?.ownedBy?.id}
                order={order}
                onCreateItem={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'CREATE_ITEM',
                    payload: {
                      entity: {
                        id: orderId,
                      },
                    },
                  });
                }}
              />
              <FilterHitBorder hasFilterHits={isMatchedEntity(matches, data)} />
              {(isOver || state.isDragging) && !isSameItem && !canDrop && (
                <Overlay
                  color={isOver ? '#EF4848' : 'rgba(239, 72, 72, 0.25)'}
                  message={isOver && dropMessage}
                  icon={<Icon icon="CANCEL" />}
                />
              )}
              {!isOver && canDrop && (
                <Overlay color="rgba(17, 209, 166, 0.25)" icon={<Icon icon="EXCHANGE" />} />
              )}
              {isOver && canDrop && (
                <Overlay message={dropMessage} icon={<Icon icon="EXCHANGE" />} color="#11D1A6" />
              )}
            </div>
          </BaseCard>
        )}
      </CellWrapper>

      <div className={ContentStyle} />
    </>
  );
}

function OrderItemCell({ data, beforeConnector, afterConnector }: CellProps) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const hasPermissions = useEntityHasPermissions(data);
  const orderId = data.orderItem?.order?.id;
  const order = entities.orders?.[orderId];
  const itemId = data.orderItem?.id;
  const [{ isOver, canDrop, isSameItem, dropMessage }, drop] = useDrop({
    accept: BATCH,
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const parentOrderId = findOrderIdByBatch(batchId, entities);
          if (!parentOrderId) return false;
          const parentOrder = entities.orders?.[parentOrderId];

          const parentItemId = findItemIdByBatch(batchId, entities);
          if (!parentItemId) return true;
          const isOwnItem = parentItemId === itemId;
          const isDifferentImporter =
            getByPathWithDefault('', 'importer.id', order) !==
            getByPathWithDefault('', 'importer.id', parentOrder);
          const isDifferentExporter =
            getByPathWithDefault('', 'exporter.id', order) !==
            getByPathWithDefault('', 'exporter.id', parentOrder);
          const noPermission = !hasPermissionToMove({
            hasPermissions,
            type,
          });
          return !isOwnItem && !isDifferentImporter && !isDifferentExporter && !noPermission;
        }

        default:
          return false;
      }
    },
    drop: () => ({ type: ORDER_ITEM, id: itemId }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isSameItem: monitor.getItem() && monitor.getItem().id === itemId,
      dropMessage: orderItemDropMessage({
        hasPermissions,
        entities,
        order,
        itemId,
        item: monitor.getItem(),
      }),
    }),
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: ORDER_ITEM, id: itemId },
    canDrag: () => false,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        dispatch({
          type: 'DND',
          payload: { item, dropResult },
        });
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const entity = `${ORDER_ITEM}-${itemId}`;
  const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
  const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${itemId}`);
  const isTargetedBatch = state.targets.includes(`${BATCH}-${data.id}`);
  const onTargetTree = () => {
    dispatch({
      type: 'TARGET_TREE',
      payload: {
        targets: [`${ORDER}-${orderId}`],
        entity,
      },
    });
  };
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity,
      },
    });
  };
  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTargetTree,
    onCtrlClick: () =>
      dispatch({
        type: 'EDIT',
        payload: {
          type: ORDER_ITEM,
          selectedId: itemId,
          orderId,
        },
      }),
  });
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isTargetedItem && isTargetedBatch}
            hasRelation={isTargetedBatch}
            type={beforeConnector}
          />
        )}
      </div>

      <CellWrapper ref={drop}>
        {isDragging ? (
          <div
            style={{
              background: '#AAAAAA',
              width: ORDER_ITEM_WIDTH - 20,
              height: '100%',
              borderRadius: '5px',
            }}
          />
        ) : (
          <BaseCard
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            isArchived={getByPathWithDefault(false, 'orderItem.archived', data)}
            selected={state.targets.includes(`${ORDER_ITEM}-${itemId}`)}
            selectable={state.targets.includes(`${ORDER_ITEM}-${itemId}`)}
            onClick={handleClick}
            flattenCornerIcon
          >
            <div ref={drag} id={`${ORDER_ITEM}-${itemId}`}>
              <Badge label={badge.orderItem?.[itemId] || ''} />
              <OrderItemCard
                organizationId={data.orderItem?.ownedBy?.id}
                orderItem={data.orderItem}
                onDeleteItem={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'DELETE_ITEM',
                    payload: {
                      entity: {
                        id: itemId,
                        no: data.orderItem?.no,
                      },
                    },
                  });
                }}
                onCreateBatch={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'CREATE_BATCH',
                    payload: {
                      entity: {
                        id: itemId,
                        no: data.orderItem?.no,
                      },
                    },
                  });
                }}
              />
              <FilterHitBorder hasFilterHits={isMatchedEntity(matches, data)} />
              {(isOver || state.isDragging) && !isSameItem && !canDrop && (
                <Overlay
                  color={isOver ? '#EF4848' : 'rgba(239, 72, 72, 0.25)'}
                  message={isOver && dropMessage}
                  icon={<Icon icon="CANCEL" />}
                />
              )}
              {!isOver && canDrop && (
                <Overlay color="rgba(17, 209, 166, 0.25)" icon={<Icon icon="EXCHANGE" />} />
              )}
              {isOver && canDrop && (
                <Overlay message={dropMessage} icon={<Icon icon="EXCHANGE" />} color="#11D1A6" />
              )}
            </div>
          </BaseCard>
        )}
      </CellWrapper>

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isTargetedOrder && isTargetedItem}
            hasRelation={isTargetedItem}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function BatchCell({
  data,
  shipment,
  beforeConnector,
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload }) {
  const hasPermissions = useEntityHasPermissions(data);
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { matches } = Hits.useContainer();
  const batchId = data?.id;
  const { entities } = mapping;
  const [{ isOver, canDrop, isSameItem }, drop] = useDrop({
    accept: [BATCH, ORDER_ITEM],
    canDrop: () => false,
    drop: () => ({ type: BATCH, id: batchId }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isSameItem: monitor.getItem() && monitor.getItem().id === batchId,
    }),
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: BATCH, id: batchId },
    begin: () => {
      dispatch({
        type: 'START_DND',
      });
    },
    canDrag: () => {
      return hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        dispatch({
          type: 'DND',
          payload: {
            from: getIdentifier({
              ...item,
              entities,
            }),
            to: getIdentifier({
              ...dropResult,
              entities,
            }),
          },
        });
      }
      dispatch({
        type: 'END_DND',
      });
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const entity = `${BATCH}-${batchId}`;
  const isTargetedBatch = state.targets.includes(`${BATCH}-${batchId}`);
  const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${data?.orderItem?.id}`);
  const isTargetedContainer =
    data?.container && state.targets.includes(`${CONTAINER}-${data?.container?.id}`);
  const isTargetedShipment =
    data?.shipment && state.targets.includes(`${SHIPMENT}-${data?.shipment?.id}`);
  const onTargetTree = () => {
    const targets = [];
    if (data?.orderItem?.id) {
      targets.push(`${ORDER_ITEM}-${data?.orderItem?.id}`);
    }
    if (data?.orderItem?.order?.id) {
      targets.push(`${ORDER}-${data?.orderItem?.order?.id}`);
    }
    dispatch({
      type: 'TARGET_TREE',
      payload: {
        targets,
        entity,
      },
    });
  };
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity,
      },
    });
  };

  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTargetTree,
    onCtrlClick: () =>
      dispatch({
        type: 'EDIT',
        payload: {
          type: BATCH,
          selectedId: batchId,
          shipmentId: shipment?.id,
        },
      }),
  });
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isTargetedBatch && (isTargetedContainer || isTargetedShipment)}
            hasRelation={isTargetedBatch}
            type={beforeConnector}
          />
        )}
      </div>

      <CellWrapper ref={drop}>
        {isDragging ? (
          <div
            style={{
              background: '#DDD',
              width: BATCH_WIDTH,
              height: '100%',
              borderRadius: '5px',
            }}
          />
        ) : (
          <BaseCard
            icon="BATCH"
            color="BATCH"
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(`${BATCH}-${batchId}`)}
            selectable={state.targets.includes(`${BATCH}-${batchId}`)}
            onClick={handleClick}
            flattenCornerIcon
          >
            <div ref={drag} id={`${BATCH}-${batchId}`}>
              <Badge label={badge.batch?.[batchId] || ''} />
              <BatchCard
                organizationId={data?.ownedBy?.id}
                batch={data}
                onDeleteBatch={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'DELETE_BATCH',
                    payload: {
                      entity: {
                        id: batchId,
                        no: data?.no,
                      },
                    },
                  });
                }}
              />
              <FilterHitBorder hasFilterHits={isMatchedEntity(matches, data)} />
              {(isOver || state.isDragging) && !isSameItem && !canDrop && (
                <Overlay
                  color={isOver ? '#EF4848' : 'rgba(239, 72, 72, 0.25)'}
                  message={isOver && 'CANNOT MOVE TO BATCH'}
                  icon={<Icon icon="CANCEL" />}
                />
              )}
              {!isOver && canDrop && <Overlay color="rgba(17, 209, 166, 0.25)" />}
              {isOver && canDrop && <Overlay color="#11D1A6" />}
            </div>
          </BaseCard>
        )}
      </CellWrapper>

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isTargetedBatch && isTargetedItem}
            hasRelation={isTargetedBatch}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function ContainerCell({
  data,
  shipment,
  beforeConnector,
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const containerId = data?.id;
  const container = entities.containers?.[containerId] ?? { id: containerId };
  const hasPermissions = useHasPermissions(container.ownedBy);
  const hasBatchPermissions = useHasPermissions(data?.relatedBatch?.ownedBy?.id);
  const shipmentId = shipment?.id ?? '';
  const [{ isOver, canDrop, isSameItem, dropMessage }, drop] = useDrop({
    accept: BATCH,
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const parentOrderId = findOrderIdByBatch(batchId, entities);
          if (!parentOrderId) return false;

          const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
          const order = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);
          const isOwnContainer = batch.container === containerId;
          const isDifferentImporter =
            shipment?.importer?.id !== getByPathWithDefault('', 'importer.id', order);
          const isDifferentExporter =
            shipment?.exporter &&
            shipment?.exporter?.id !== getByPathWithDefault('', 'exporter.id', order);
          const noPermission = !hasPermissionToMove({
            hasPermissions,
            type: SHIPMENT,
          });
          return !isOwnContainer && !isDifferentImporter && !isDifferentExporter && !noPermission;
        }

        default:
          return false;
      }
    },
    drop: () => ({ type: CONTAINER, id: containerId }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isSameItem: monitor.getItem() && monitor.getItem().id === containerId,
      dropMessage: containerDropMessage({
        hasPermissions,
        entities,
        containerId,
        item: monitor.getItem(),
      }),
    }),
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: CONTAINER, id: containerId },
    canDrag: () => false,
    begin: () => {
      dispatch({
        type: 'START_DND',
      });
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        dispatch({
          type: 'DND',
          payload: { item, dropResult },
        });
      }
      dispatch({
        type: 'END_DND',
      });
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const isTargetedContainer = state.targets.includes(`${CONTAINER}-${containerId}`);
  const isTargetedBatch = state.targets.includes(
    `${BATCH}-${getByPathWithDefault('', 'relatedBatch.id', data)}`
  );
  const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipmentId}`);
  const entity = `${CONTAINER}-${containerId}`;
  const onTargetTree = () => {
    const targets = [];
    (shipment?.batches ?? []).forEach(batch => {
      if (containerId === batch?.container?.id) {
        targets.push(`${BATCH}-${batch.id}`);
        if (!targets.includes(`${ORDER_ITEM}-${batch.orderItem?.id}`)) {
          targets.push(`${ORDER_ITEM}-${batch.orderItem?.id}`);
        }
        if (!targets.includes(`${ORDER}-${batch.orderItem?.order?.id}`)) {
          targets.push(`${ORDER}-${batch.orderItem?.order?.id}`);
        }
      }
    });
    dispatch({
      type: 'TARGET_TREE',
      payload: {
        targets,
        entity,
      },
    });
  };
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity,
      },
    });
  };
  const orderIds = Object.keys(entities.orders).filter(orderId =>
    getByPathWithDefault([], 'shipments', entities.orders[orderId]).includes(shipmentId)
  );
  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTargetTree,
    onCtrlClick: () =>
      dispatch({
        type: 'EDIT',
        payload: {
          type: CONTAINER,
          selectedId: containerId,
          orderIds,
        },
      }),
  });
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isTargetedContainer && isTargetedBatch}
            hasRelation={isTargetedContainer && isTargetedBatch}
            type={beforeConnector}
          >
            {hasBatchPermissions([BATCH_UPDATE]) && (
              <RemoveButton
                offset
                onClick={() => {
                  dispatch({
                    type: 'REMOVE_BATCH',
                    payload: {
                      entity: {
                        id: data?.relatedBatch?.id,
                        no: data?.relatedBatch?.no,
                      },
                      from: {
                        type: 'CONTAINER',
                        id: data?.relatedBatch?.container,
                      },
                    },
                  });
                }}
              />
            )}
          </RelationLine>
        )}
      </div>

      <CellWrapper ref={drop}>
        {isDragging ? (
          <div
            style={{
              background: '#AAAAAA',
              width: CONTAINER_WIDTH - 20,
              height: '100%',
              borderRadius: '5px',
            }}
          />
        ) : (
          <BaseCard
            icon="CONTAINER"
            color="CONTAINER"
            isArchived={getByPathWithDefault(false, `containers.${containerId}.archived`, entities)}
            selected={state.targets.includes(`${CONTAINER}-${containerId}`)}
            selectable={state.targets.includes(`${CONTAINER}-${containerId}`)}
            onClick={handleClick}
            flattenCornerIcon
          >
            <div ref={drag}>
              <Badge label={badge.container?.[containerId] || ''} />
              <ContainerCard container={container} />
              <FilterHitBorder hasFilterHits={isMatchedEntity(matches, data)} />
              {(isOver || state.isDragging) && !isSameItem && !canDrop && (
                <Overlay
                  color={isOver ? '#EF4848' : 'rgba(239, 72, 72, 0.25)'}
                  message={isOver && dropMessage}
                  icon={<Icon icon="CANCEL" />}
                />
              )}
              {!isOver && canDrop && (
                <Overlay color="rgba(17, 209, 166, 0.25)" icon={<Icon icon="EXCHANGE" />} />
              )}
              {isOver && canDrop && (
                <Overlay message={dropMessage} icon={<Icon icon="EXCHANGE" />} color="#11D1A6" />
              )}
            </div>
          </BaseCard>
        )}
      </CellWrapper>

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isTargetedContainer && isTargetedShipment}
            hasRelation={isTargetedContainer && isTargetedShipment}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function ShipmentCell({
  // $FlowIgnore: does not support
  shipment,
  beforeConnector,
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const shipmentId = shipment?.id;
  const hasPermissions = useHasPermissions(shipment?.ownedBy?.id);
  const [{ isOver, canDrop, isSameItem, dropMessage }, drop] = useDrop({
    accept: BATCH,
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const parentOrderId = findOrderIdByBatch(batchId, entities);
          if (!parentOrderId) return false;

          const parentItemId = findItemIdByBatch(batchId, entities);
          if (!parentItemId) return true;

          const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
          const order = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);
          const isOwnShipment = batch.shipment === shipmentId;
          const isDifferentImporter =
            shipment?.importer?.id !== getByPathWithDefault('', 'importer.id', order);
          const isDifferentExporter =
            shipment?.exporter &&
            shipment?.importer?.id !== getByPathWithDefault('', 'exporter.id', order);
          const noPermission = !hasPermissionToMove({
            hasPermissions,
            type: SHIPMENT,
          });
          return !isOwnShipment && !isDifferentImporter && !isDifferentExporter && !noPermission;
        }

        default:
          return false;
      }
    },
    drop: () => ({ type: SHIPMENT, id: shipmentId }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isSameItem: monitor.getItem() && monitor.getItem().id === shipmentId,
      dropMessage: shipmentDropMessage({
        hasPermissions,
        entities,
        shipmentId,
        item: monitor.getItem(),
      }),
    }),
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: SHIPMENT, id: shipmentId },
    canDrag: () => false,
    begin: () => {
      dispatch({
        type: 'START_DND',
      });
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        dispatch({
          type: 'DND',
          payload: { item, dropResult },
        });
      }
      dispatch({
        type: 'END_DND',
      });
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipmentId}`);
  const isTargetedRelateEntity =
    (shipment?.containers ?? []).some(container =>
      state.targets.includes(`${CONTAINER}-${container.id}`)
    ) || (shipment?.batches ?? []).some(batch => state.targets.includes(`${BATCH}-${batch.id}`));
  const entity = `${SHIPMENT}-${shipmentId}`;
  const onTargetTree = () => {
    const targets = [];
    (shipment?.containers ?? []).forEach(container => {
      targets.push(`${CONTAINER}-${container.id}`);
    });
    (shipment?.batches ?? []).forEach(batch => {
      targets.push(`${BATCH}-${batch.id}`);
      if (!targets.includes(`${ORDER_ITEM}-${batch.orderItem?.id}`)) {
        targets.push(`${ORDER_ITEM}-${batch.orderItem?.id}`);
      }
      if (!targets.includes(`${ORDER}-${batch.orderItem?.order?.id}`)) {
        targets.push(`${ORDER}-${batch.orderItem?.order?.id}`);
      }
    });
    dispatch({
      type: 'TARGET_TREE',
      payload: {
        targets,
        entity,
      },
    });
  };
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity: `${SHIPMENT}-${shipmentId}`,
      },
    });
  };

  const orderIds = (shipment?.batches ?? [])
    .map(batch => batch.orderItem?.order?.id)
    .filter(Boolean);
  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTargetTree,
    onCtrlClick: () =>
      dispatch({
        type: 'EDIT',
        payload: {
          type: SHIPMENT,
          selectedId: shipmentId,
          orderIds,
        },
      }),
  });
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isTargetedShipment && isTargetedRelateEntity}
            hasRelation={isTargetedShipment && isTargetedRelateEntity}
            type={beforeConnector}
          />
        )}
      </div>

      <CellWrapper ref={drop}>
        {isDragging ? (
          <div
            style={{
              background: '#AAAAAA',
              width: SHIPMENT_WIDTH - 20,
              height: '100%',
              borderRadius: '5px',
            }}
          />
        ) : (
          <BaseCard
            icon="SHIPMENT"
            color="SHIPMENT"
            isArchived={shipment?.archived}
            selected={state.targets.includes(`${SHIPMENT}-${shipmentId}`)}
            selectable={state.targets.includes(`${SHIPMENT}-${shipmentId}`)}
            onClick={handleClick}
            flattenCornerIcon
          >
            <div ref={drag} id={`${SHIPMENT}-${shipmentId}`}>
              <Badge label={badge.shipment?.[shipmentId] || ''} />
              <ShipmentCard shipment={shipment} />
              <FilterHitBorder hasFilterHits={isMatchedEntity(matches, shipment)} />
              {(isOver || state.isDragging) && !isSameItem && !canDrop && (
                <Overlay
                  color={isOver ? '#EF4848' : 'rgba(239, 72, 72, 0.25)'}
                  message={isOver && dropMessage}
                  icon={<Icon icon="CANCEL" />}
                />
              )}
              {!isOver && canDrop && (
                <Overlay color="rgba(17, 209, 166, 0.25)" icon={<Icon icon="EXCHANGE" />} />
              )}
              {isOver && canDrop && (
                <Overlay message={dropMessage} icon={<Icon icon="EXCHANGE" />} color="#11D1A6" />
              )}
            </div>
          </BaseCard>
        )}
      </CellWrapper>

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isTargetedShipment && isTargetedRelateEntity}
            hasRelation={isTargetedShipment && isTargetedRelateEntity}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function NoContainerCell({ data, beforeConnector, afterConnector }: CellProps) {
  const { state, dispatch } = FocusedView.useContainer();
  const isTargetedBatch = state.targets.includes(
    `${BATCH}-${getByPathWithDefault('', 'relatedBatch.id', data)}`
  );
  const isTargetedShipment = state.targets.includes(
    `${SHIPMENT}-${getByPathWithDefault('', 'relatedBatch.shipment.id', data)}`
  );
  const hasBatchPermissions = useHasPermissions(data?.relatedBatch?.ownedBy?.id);
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isTargetedBatch && isTargetedShipment}
            hasRelation={isTargetedBatch && isTargetedShipment}
            type={beforeConnector}
          />
        )}
      </div>

      <div style={{ width: CONTAINER_WIDTH }} className={ContentStyle}>
        <RelationLine
          isTargeted={isTargetedBatch && isTargetedShipment}
          hasRelation={isTargetedBatch && isTargetedShipment}
          type="HORIZONTAL"
        >
          {hasBatchPermissions([BATCH_UPDATE]) && (
            <RemoveButton
              onClick={() => {
                dispatch({
                  type: 'REMOVE_BATCH',
                  payload: {
                    entity: {
                      id: data?.relatedBatch?.id,
                      no: data?.relatedBatch?.no,
                    },
                    from: {
                      type: 'SHIPMENT',
                      id: data?.relatedBatch?.shipment?.id,
                    },
                  },
                });
              }}
            />
          )}
        </RelationLine>
      </div>

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isTargetedBatch && isTargetedShipment}
            hasRelation={isTargetedBatch && isTargetedShipment}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function ItemSummaryCell({
  data,
  onClick,
  isExpand,
  beforeConnector,
  afterConnector,
}: CellProps & { isExpand: boolean, onClick: Function }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { matches } = Hits.useContainer();
  const { mapping } = Entities.useContainer();
  const orderItemIds = data.batches.map(batch => batch.orderItem?.id).filter(Boolean);
  const orderItems = data.batches.map(batch => batch.orderItem).filter(Boolean);
  const orderIds = data.batches.map(batch => batch.orderItem?.order?.id).filter(Boolean);
  const batchIds = data.batches.map(batch => batch.id).filter(Boolean);
  const selected = orderItemIds.some(itemId => state.targets.includes(`${ORDER_ITEM}-${itemId}`));
  const isTargetedAnyItems = orderItemIds.some(itemId =>
    state.targets.includes(`${ORDER_ITEM}-${itemId}`)
  );
  const isTargetedAnyBatches = batchIds.some(batchId =>
    state.targets.includes(`${BATCH}-${batchId}`)
  );
  const isTargetedAnyOrders = orderIds.some(oderId => state.targets.includes(`${ORDER}-${oderId}`));
  const isMatched = orderItemIds.some(
    itemId =>
      matches?.entity?.[
        `${mapping?.entities?.orderItems?.[itemId]?.productProvider?.product?.id}-${PRODUCT}`
      ]
  );
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isExpand ? false : isTargetedAnyBatches && isTargetedAnyItems}
            hasRelation={isExpand ? false : isTargetedAnyBatches}
            type={beforeConnector}
          />
        )}
      </div>

      <CellWrapper isExpandedHeading={isExpand}>
        <OrderItemHeading
          orderItems={orderItems}
          hasSelectedChildren={selected}
          hasFilterHits={isMatched}
          isExpanded={isExpand}
          onClick={onClick}
          total={data?.orderItemCount || 0}
          onSelectAll={() => {
            const targets = orderItems.map(item => `${ORDER_ITEM}-${item?.id}`);
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets,
              },
            });
          }}
        />
      </CellWrapper>

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isExpand ? false : isTargetedAnyItems && isTargetedAnyOrders}
            hasRelation={isExpand ? false : isTargetedAnyOrders}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function BatchSummaryCell({
  onClick,
  // $FlowIgnore: does not support
  shipment,
  isExpand,
  beforeConnector,
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload, isExpand: boolean, onClick: Function }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { matches } = Hits.useContainer();
  const orderItemIds = (shipment?.batches ?? []).map(batch => batch.orderItem?.id).filter(Boolean);
  const batchIds = (shipment?.batches ?? []).map(batch => batch.id).filter(Boolean);
  const isTargetedAnyItems = orderItemIds.some(itemId =>
    state.targets.includes(`${ORDER_ITEM}-${itemId}`)
  );
  const isTargetedAnyBatches = batchIds.some(batchId =>
    state.targets.includes(`${BATCH}-${batchId}`)
  );
  const containerCount = shipment?.containerCount ?? 0;
  const batchCount = shipment?.batchCount ?? 0;
  const containerIds = (shipment?.containers ?? []).map(container => container.id).filter(Boolean);
  const isTargetedAnyContainers = containerIds.some(containerId =>
    state.targets.includes(`${CONTAINER}-${containerId}`)
  );
  const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipment?.id}`);
  const isTargeted = containerCount
    ? isTargetedAnyBatches && isTargetedAnyContainers
    : isTargetedAnyBatches && isTargetedShipment;
  const hasRelation = containerCount
    ? isTargetedAnyBatches && isTargetedAnyContainers
    : isTargetedAnyBatches && isTargetedShipment;
  const isMatched = batchIds.some(itemId => matches.entity && matches.entity[`${itemId}-${BATCH}`]);
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isExpand ? false : isTargeted}
            hasRelation={isExpand ? false : hasRelation}
            type={beforeConnector}
          />
        )}
      </div>

      {batchCount ? (
        <CellWrapper isExpandedHeading={isExpand}>
          <BatchHeading
            batches={shipment?.batches ?? []}
            hasSelectedChildren={isTargetedAnyBatches}
            hasFilterHits={isMatched}
            isExpanded={isExpand}
            onClick={onClick}
            total={batchCount}
            onSelectAll={() => {
              const targets = [];
              batchIds.forEach(id => targets.push(`${BATCH}-${id}`));
              dispatch({
                type: 'TARGET_ALL',
                payload: {
                  targets,
                },
              });
            }}
          />
        </CellWrapper>
      ) : (
        <div
          style={{
            width: BATCH_WIDTH,
          }}
          className={ContentStyle}
        />
      )}

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isExpand ? false : isTargetedAnyItems && isTargetedAnyBatches}
            hasRelation={isExpand ? false : isTargetedAnyBatches}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function ContainerSummaryCell({
  onClick,
  // $FlowIgnore: does not support
  shipment,
  isExpand,
  beforeConnector,
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload, isExpand: boolean, onClick: Function }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { matches } = Hits.useContainer();
  const containerCount = shipment?.containerCount ?? 0;
  const batchCount = shipment?.batchCount ?? 0;
  const batchIds = (shipment?.batches ?? []).map(batch => batch?.id).filter(Boolean);
  const containerIds = (shipment?.containers ?? []).map(container => container?.id).filter(Boolean);
  const isTargetedAnyBatches = batchIds.some(batchId =>
    state.targets.includes(`${BATCH}-${batchId}`)
  );
  const isTargetedAnyContainers = containerIds.some(containerId =>
    state.targets.includes(`${CONTAINER}-${containerId}`)
  );
  const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipment?.id}`);
  const beforeLine = {
    isTargeted: containerCount
      ? isTargetedAnyContainers && isTargetedShipment
      : isTargetedShipment && isTargetedAnyBatches,
    hasRelation: isTargetedShipment,
  };
  const afterLine = {
    isTargeted: containerCount
      ? isTargetedAnyBatches && isTargetedAnyContainers
      : isTargetedAnyBatches && isTargetedShipment,
    hasRelation: containerCount
      ? isTargetedAnyBatches && isTargetedAnyContainers
      : isTargetedAnyBatches && isTargetedShipment,
  };
  const isMatched = containerIds.some(
    containerId => matches.entity && matches.entity[`${containerId}-${CONTAINER}`]
  );
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isExpand ? false : beforeLine.isTargeted}
            hasRelation={isExpand ? false : beforeLine.hasRelation}
            type={beforeConnector}
          />
        )}
      </div>

      {(() => {
        if (containerCount) {
          return (
            <CellWrapper isExpandedHeading={isExpand}>
              <ContainerHeading
                containers={shipment?.containers || []}
                hasSelectedChildren={isTargetedAnyContainers}
                hasFilterHits={isMatched}
                isExpanded={isExpand}
                onClick={onClick}
                total={containerCount}
                onSelectAll={() => {
                  const targets = [];

                  containerIds.forEach(id => targets.push(`${CONTAINER}-${id}`));

                  dispatch({
                    type: 'TARGET_ALL',
                    payload: {
                      targets,
                    },
                  });
                }}
              />
            </CellWrapper>
          );
        }

        if (batchCount) {
          return (
            <div style={{ width: CONTAINER_WIDTH }} className={ContentStyle}>
              <RelationLine
                isTargeted={isTargetedShipment && isTargetedAnyBatches}
                hasRelation={isTargetedShipment && isTargetedAnyBatches}
                type="HORIZONTAL"
              />
            </div>
          );
        }

        return <div style={{ width: CONTAINER_WIDTH }} className={ContentStyle} />;
      })()}

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isExpand ? false : afterLine.isTargeted}
            hasRelation={isExpand ? false : afterLine.hasRelation}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function OrderSummaryCell({
  onClick,
  shipment,
  isExpand,
  beforeConnector,
}: CellProps & { shipment: ?ShipmentPayload, isExpand: boolean, onClick: Function }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { matches } = Hits.useContainer();
  const itemIds = (shipment?.batches ?? []).map(batch => batch.orderItem?.id).filter(Boolean);
  const orderIds = (shipment?.batches ?? [])
    .map(batch => batch.orderItem?.order?.id)
    .filter(Boolean);
  const isTargetedAnyItems = itemIds.some(itemId =>
    state.targets.includes(`${ORDER_ITEM}-${itemId}`)
  );
  const orders = [
    ...new Set((shipment?.batches ?? []).map(batch => batch.orderItem?.order).filter(Boolean)),
  ];
  const isTargetedAnyOrders = orderIds.some(orderId =>
    state.targets.includes(`${ORDER}-${orderId}`)
  );
  const beforeLine = {
    isTargeted: isTargetedAnyItems && isTargetedAnyOrders,
    hasRelation: isTargetedAnyItems,
  };
  const isMatched = orderIds.some(itemId => matches.entity && matches.entity[`${itemId}-${ORDER}`]);
  const orderCount = shipment?.orderCount ?? 0;
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isExpand ? false : beforeLine.isTargeted}
            hasRelation={isExpand ? false : beforeLine.hasRelation}
            type={beforeConnector}
          />
        )}
      </div>
      {orderIds.length ? (
        <CellWrapper isExpandedHeading={isExpand}>
          <OrderHeading
            orders={orders}
            hasSelectedChildren={isTargetedAnyOrders}
            hasFilterHits={isMatched}
            isExpanded={isExpand}
            onClick={onClick}
            total={orderCount}
            onSelectAll={() => {
              const targets = [];
              orderIds.forEach(id => targets.push(`${ORDER}-${id}`));

              dispatch({
                type: 'TARGET_ALL',
                payload: {
                  targets,
                },
              });
            }}
          />
        </CellWrapper>
      ) : (
        <div style={{ width: ORDER_WIDTH }} className={ContentStyle} />
      )}

      <div className={ContentStyle} />
    </>
  );
}

function DuplicateShipmentCell({
  // $FlowIgnore: does not support
  shipment,
  beforeConnector,
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload }) {
  const { state } = FocusedView.useContainer();
  const shipmentId = shipment?.id;
  const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipmentId}`);

  const connector = {
    isTargeted: isTargetedShipment,
    hasRelation: false,
  };
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={connector.isTargeted}
            hasRelation={connector.hasRelation}
            type={beforeConnector}
          />
        )}
      </div>

      <div
        style={{
          width: SHIPMENT_WIDTH + 150,
        }}
        className={ContentStyle}
      />

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={connector.isTargeted}
            hasRelation={connector.hasRelation}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

// TODO: fix the card
function DuplicateContainerCell({ data, beforeConnector, afterConnector }: CellProps) {
  const { state } = FocusedView.useContainer();
  const { getRelatedBy } = Entities.useContainer();
  const { getBatchesSortByItemId } = ClientSorts.useContainer();
  const batchPosition = data?.batchPosition ?? 0;
  const itemId = data.item?.id;
  const originalBatches = data.item?.batches ?? [];
  const batchList = getBatchesSortByItemId({
    id: itemId,
    batches: originalBatches,
    getRelatedBy,
  }).filter(batchId => originalBatches.find(batch => batch?.id === batchId));

  let foundPosition = -1;
  for (let index = batchList.length - 1; index > 0; index -= 1) {
    const isTargetedBatch = state.targets.includes(`${BATCH}-${batchList[index]}`);
    if (isTargetedBatch) {
      foundPosition = index;
      break;
    }
  }

  const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${itemId}`);

  const connector = {
    isTargeted: isTargetedItem && foundPosition >= batchPosition,
    hasRelation: false,
  };
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={connector.isTargeted}
            hasRelation={connector.hasRelation}
            type={beforeConnector}
          />
        )}
      </div>

      <div
        style={{
          width: CONTAINER_WIDTH,
        }}
        className={ContentStyle}
      />

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={connector.isTargeted}
            hasRelation={connector.hasRelation}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

const cellRenderer = (
  cell: ?CellRender,
  {
    onClick,
    isExpand,
    shipment,
  }: {
    onClick: Function,
    isExpand: boolean,
    shipment: ShipmentPayload,
  }
) => {
  if (!cell)
    return (
      <div
        style={{
          display: 'flex',
        }}
        key={uuid()}
      >
        <div className={ContentStyle} />
        <div className={ContentStyle} />
        <div className={ContentStyle} />
      </div>
    );
  const { beforeConnector, type, data, entity, afterConnector } = cell;
  let content = <div className={ContentStyle} />;
  switch (type) {
    case 'placeholder': {
      const color = getColorByEntity(entity);
      const icon = getIconByEntity(entity);
      content = (
        <div className={ContentStyle}>
          <BaseCard icon={icon} color={color}>
            <LoadingIcon />
          </BaseCard>
        </div>
      );
      break;
    }
    case 'shipmentPlaceholder': {
      return (
        <div
          style={{
            display: 'flex',
            width: SHIPMENT_WIDTH + 170,
          }}
          key={uuid()}
        >
          <div className={ContentStyle} />
          <div className={ContentStyle} />
          <div className={ContentStyle} />
        </div>
      );
    }
    case 'containerPlaceholder': {
      return (
        <div
          style={{
            display: 'flex',
            width: CONTAINER_WIDTH + 40,
          }}
          key={uuid()}
        >
          <div className={ContentStyle} />
          <div className={ContentStyle} />
          <div className={ContentStyle} />
        </div>
      );
    }
    case ORDER: {
      content = (
        <OrderCell data={data} beforeConnector={beforeConnector} afterConnector={afterConnector} />
      );
      break;
    }
    case ORDER_ITEM: {
      content = (
        <OrderItemCell
          data={data}
          shipment={shipment}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case BATCH: {
      content = (
        <BatchCell
          data={data}
          shipment={shipment}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case CONTAINER: {
      content = (
        <ContainerCell
          data={data}
          shipment={shipment}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case SHIPMENT: {
      content = (
        <ShipmentCell
          data={data}
          shipment={shipment}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case 'shipmentWithoutContainer':
      content = (
        <NoContainerCell
          data={data}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;

    case 'itemSummary': {
      content = (
        <ItemSummaryCell
          data={data}
          onClick={onClick}
          isExpand={isExpand}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case 'batchSummary': {
      content = (
        <BatchSummaryCell
          data={data}
          shipment={shipment}
          onClick={onClick}
          isExpand={isExpand}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case 'containerSummary': {
      content = (
        <ContainerSummaryCell
          data={data}
          shipment={shipment}
          onClick={onClick}
          isExpand={isExpand}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case 'orderSummary': {
      content = (
        <OrderSummaryCell
          data={data}
          shipment={shipment}
          onClick={onClick}
          isExpand={isExpand}
          beforeConnector={beforeConnector}
        />
      );

      break;
    }
    case 'duplicateShipment': {
      content = (
        <DuplicateShipmentCell
          data={data}
          shipment={shipment}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case 'duplicateContainer': {
      content = (
        <DuplicateContainerCell
          data={data}
          shipment={shipment}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    default:
      content = <div className={ContentStyle}>{type}</div>;
  }
  return (
    <div
      style={{
        display: 'flex',
      }}
      key={`${getByPathWithDefault(uuid(), 'data.id', cell)}-${type}`}
    >
      {content}
    </div>
  );
};

export default cellRenderer;
