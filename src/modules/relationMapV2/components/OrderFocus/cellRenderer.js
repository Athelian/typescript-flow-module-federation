/* eslint-disable react/no-unused-prop-types */
// @flow
import * as React from 'react';
import type { OrderPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { useDrop, useDrag } from 'react-dnd';
import { flatten } from 'lodash';
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
  findParentIdsByBatch,
  isMatchedEntity,
  getIdentifier,
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
import ShipmentHeading from '../ShipmentHeading';
import { ContentStyle } from './style';

type CellProps = {
  data: Object,
  beforeConnector?: ?LINE_CONNECTOR,
  afterConnector?: ?LINE_CONNECTOR,
};

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
      const [, parentOrderId] = findParentIdsByBatch({ batchId, entities, viewer: ORDER });
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
      const [parentItemId, parentOrderId] = findParentIdsByBatch({
        batchId,
        entities,
        viewer: ORDER,
      });
      if (!parentItemId || !parentOrderId) return '';

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
      const [, parentOrderId] = findParentIdsByBatch({ batchId, entities, viewer: ORDER });
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
      const [, parentOrderId] = findParentIdsByBatch({ batchId, entities, viewer: ORDER });
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

function OrderCell({ data, afterConnector }: CellProps) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const hasPermissions = useEntityHasPermissions(data);
  const orderId = getByPathWithDefault('', 'id', data);
  const [{ isOver, canDrop, dropMessage, isSameItem }, drop] = useDrop({
    accept: [BATCH, ORDER_ITEM],
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const [, parentOrderId] = findParentIdsByBatch({ batchId, entities, viewer: ORDER });
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
  const entity = `${ORDER}-${getByPathWithDefault('', 'id', data)}`;
  const onTargetTree = () => {
    const targets = [];
    const orderItems = getByPathWithDefault([], 'orderItems', data);
    orderItems.forEach(item => {
      targets.push(`${ORDER_ITEM}-${getByPathWithDefault('', 'id', item)}`);
      const batches = getByPathWithDefault([], 'batches', item);
      batches.forEach(batch => {
        targets.push(`${BATCH}-${getByPathWithDefault('', 'id', batch)}`);
        if (batch.container) {
          targets.push(`${CONTAINER}-${getByPathWithDefault('', 'container.id', batch)}`);
        }
        if (batch.shipment) {
          targets.push(`${SHIPMENT}-${getByPathWithDefault('', 'shipment.id', batch)}`);
        }
      });
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
  const orderItemIds = flatten(
    getByPathWithDefault([], 'orderItems', data).map(item => getByPathWithDefault('', 'id', item))
  ).filter(Boolean);
  const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
  const isTargetedAnyItems = orderItemIds.some(itemId =>
    state.targets.includes(`${ORDER_ITEM}-${itemId}`)
  );

  const isTargeted = isTargetedOrder && isTargetedAnyItems;
  const hasRelation = isTargetedAnyItems;
  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTargetTree,
    onCtrlClick: () =>
      // TODO: Check view form permissions
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
      <div className={ContentStyle} />

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
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(`${ORDER}-${getByPathWithDefault('', 'id', data)}`)}
            selectable={state.targets.includes(`${ORDER}-${getByPathWithDefault('', 'id', data)}`)}
            onClick={handleClick}
            flattenCornerIcon
          >
            <div ref={drag} id={`${ORDER}-${orderId}`}>
              <Badge label={badge.order?.[orderId] || ''} />
              <OrderCard
                organizationId={data?.ownedBy?.id}
                order={data}
                onViewForm={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'EDIT',
                    payload: {
                      type: ORDER,
                      selectedId: orderId,
                    },
                  });
                }}
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

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine isTargeted={isTargeted} hasRelation={hasRelation} type={afterConnector} />
        )}
      </div>
    </>
  );
}

function OrderItemCell({
  data,
  beforeConnector,
  afterConnector,
  order,
}: CellProps & { order: OrderPayload }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const hasPermissions = useEntityHasPermissions(data);
  const orderId = getByPathWithDefault('', 'id', order);
  const itemId = getByPathWithDefault('', 'id', data);
  const [{ isOver, canDrop, isSameItem, dropMessage }, drop] = useDrop({
    accept: BATCH,
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const [parentItemId, parentOrderId] = findParentIdsByBatch({
            batchId,
            entities,
            viewer: ORDER,
          });
          if (!parentOrderId || !parentItemId) return false;
          const parentOrder = entities.orders?.[parentOrderId];
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
  const batchIds = flatten(
    getByPathWithDefault([], 'batches', data).map(item => getByPathWithDefault('', 'id', item))
  );
  const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
  const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${itemId}`);
  const isTargetedAnyBatches = batchIds.some(batchId =>
    state.targets.includes(`${BATCH}-${batchId}`)
  );
  const onTargetTree = () => {
    const targets = [];
    const batches = getByPathWithDefault([], 'batches', data);
    batches.forEach(batch => {
      targets.push(`${BATCH}-${getByPathWithDefault('', 'id', batch)}`);
      if (batch.container) {
        targets.push(`${CONTAINER}-${getByPathWithDefault('', 'container.id', batch)}`);
      }
      if (batch.shipment) {
        targets.push(`${SHIPMENT}-${getByPathWithDefault('', 'shipment.id', batch)}`);
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
  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTargetTree,
    onCtrlClick: () =>
      // TODO: Check view form permissions
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
            isTargeted={isTargetedOrder && isTargetedItem}
            hasRelation={isTargetedItem}
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
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(
              `${ORDER_ITEM}-${getByPathWithDefault('', 'id', data)}`
            )}
            selectable={state.targets.includes(
              `${ORDER_ITEM}-${getByPathWithDefault('', 'id', data)}`
            )}
            onClick={handleClick}
            flattenCornerIcon
          >
            <div ref={drag} id={`${ORDER_ITEM}-${itemId}`}>
              <Badge label={badge.orderItem?.[itemId] || ''} />
              <OrderItemCard
                organizationId={data?.ownedBy?.id}
                orderItem={data}
                onViewForm={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'EDIT',
                    payload: {
                      type: ORDER_ITEM,
                      selectedId: itemId,
                      orderId,
                    },
                  });
                }}
                onDeleteItem={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'DELETE_ITEM',
                    payload: {
                      entity: {
                        id: itemId,
                        no: data?.no,
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
            isTargeted={isTargetedItem && isTargetedAnyBatches}
            hasRelation={isTargetedAnyBatches}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function BatchCell({
  data,
  order,
  beforeConnector,
  afterConnector,
}: CellProps & { order: OrderPayload }) {
  const hasPermissions = useEntityHasPermissions(data);
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { matches } = Hits.useContainer();
  const batchId = getByPathWithDefault('', 'id', data);
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
  const orderId = getByPathWithDefault('', 'id', order);
  const orderItems = getByPathWithDefault([], 'orderItems', order);
  const foundParentItem = orderItems.find(item =>
    item.batches.map(batch => batch.id).includes(batchId)
  );
  const batch = foundParentItem.batches.find(item => item.id === batchId);
  const isTargetedBatch = state.targets.includes(`${BATCH}-${batchId}`);
  const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${foundParentItem.id}`);
  const isTargetedContainer =
    batch.container && state.targets.includes(`${CONTAINER}-${batch.container.id}`);
  const isTargetedShipment =
    batch.shipment && state.targets.includes(`${SHIPMENT}-${batch.shipment.id}`);
  const onTargetTree = () => {
    const targets = [];
    if (data.container) {
      targets.push(`${CONTAINER}-${getByPathWithDefault('', 'container.id', data)}`);
    }
    if (data.shipment) {
      targets.push(`${SHIPMENT}-${getByPathWithDefault('', 'shipment.id', data)}`);
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
      // TODO: Check view form permissions
      dispatch({
        type: 'EDIT',
        payload: {
          type: BATCH,
          selectedId: batchId,
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
            hasRelation={isTargetedItem && isTargetedBatch}
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
            selected={state.targets.includes(`${BATCH}-${getByPathWithDefault('', 'id', data)}`)}
            selectable={state.targets.includes(`${BATCH}-${getByPathWithDefault('', 'id', data)}`)}
            onClick={handleClick}
            flattenCornerIcon
          >
            <div ref={drag} id={`${BATCH}-${batchId}`}>
              <Badge label={badge.batch?.[batchId] || ''} />
              <BatchCard
                organizationId={data?.ownedBy?.id}
                batch={data}
                onViewForm={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'EDIT',
                    payload: {
                      type: BATCH,
                      selectedId: batchId,
                      orderId,
                    },
                  });
                }}
                onDeleteBatch={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'DELETE_BATCH',
                    payload: {
                      entity: {
                        id: data?.id,
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
            isTargeted={isTargetedBatch && (isTargetedContainer || isTargetedShipment)}
            hasRelation={isTargetedBatch}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function ContainerCell({ data, beforeConnector, afterConnector }: CellProps) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const containerId = data?.id;
  const container = entities.containers?.[containerId] ?? { id: containerId };
  const hasPermissions = useHasPermissions(container.ownedBy);
  const hasBatchPermissions = useHasPermissions(data?.relatedBatch?.ownedBy?.id);
  const shipmentId = getByPathWithDefault('', 'relatedBatch.shipment.id', data);
  const [{ isOver, canDrop, isSameItem, dropMessage }, drop] = useDrop({
    accept: BATCH,
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const [, parentOrderId] = findParentIdsByBatch({
            batchId,
            entities,
            viewer: ORDER,
          });
          if (!parentOrderId) return false;

          const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
          const order = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);
          const shipment = getByPathWithDefault({}, `shipments.${container.shipment}`, entities);
          const isOwnContainer = batch.container === containerId;
          const isDifferentImporter =
            getByPathWithDefault('', 'importer.id', shipment) !==
            getByPathWithDefault('', 'importer.id', order);
          const isDifferentExporter =
            shipment.exporter &&
            getByPathWithDefault('', 'exporter.id', shipment) !==
              getByPathWithDefault('', 'exporter.id', order);
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
  const isTargetedShipment = state.targets.includes(
    `${SHIPMENT}-${getByPathWithDefault('', 'relatedBatch.shipment.id', data)}`
  );
  const entity = `${CONTAINER}-${containerId}`;
  const onTargetTree = () => {
    const targets = [];
    if (data.relatedBatch && data.relatedBatch.shipment) {
      targets.push(`${SHIPMENT}-${getByPathWithDefault('', 'relatedBatch.shipment.id', data)}`);
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
  const orderIds = Object.keys(entities.orders).filter(orderId =>
    getByPathWithDefault([], 'shipments', entities.orders[orderId]).includes(shipmentId)
  );
  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTargetTree,
    onCtrlClick: () =>
      // TODO: Check view form permissions
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
              <ContainerCard
                organizationId={container?.ownedBy}
                container={container}
                onViewForm={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'EDIT',
                    payload: {
                      type: CONTAINER,
                      selectedId: containerId,
                      orderIds,
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
            isTargeted={isTargetedContainer && isTargetedShipment}
            hasRelation={isTargetedContainer && isTargetedShipment}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function ShipmentCell({ data, beforeConnector }: CellProps) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const shipmentId = data?.id;
  const shipment = entities.shipments?.[shipmentId] ?? { id: shipmentId };
  const hasPermissions = useHasPermissions(shipment.ownedBy);
  const [{ isOver, canDrop, isSameItem, dropMessage }, drop] = useDrop({
    accept: BATCH,
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const [parentItemId, parentOrderId] = findParentIdsByBatch({
            batchId,
            entities,
            viewer: ORDER,
          });
          if (!parentItemId || !parentOrderId) return false;

          const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
          const order = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);
          const isOwnShipment = batch.shipment === shipmentId;
          const isDifferentImporter =
            getByPathWithDefault('', 'importer.id', shipment) !==
            getByPathWithDefault('', 'importer.id', order);
          const isDifferentExporter =
            shipment.exporter &&
            getByPathWithDefault('', 'exporter.id', shipment) !==
              getByPathWithDefault('', 'exporter.id', order);
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
  const isTargetedRelateEntity = getByPathWithDefault(null, 'relatedBatch.container', data)
    ? state.targets.includes(
        `${CONTAINER}-${getByPathWithDefault('', 'relatedBatch.container.id', data)}`
      )
    : state.targets.includes(`${BATCH}-${getByPathWithDefault('', 'relatedBatch.id', data)}`);
  const entity = `${SHIPMENT}-${shipmentId}`;
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity: `${SHIPMENT}-${shipmentId}`,
      },
    });
  };

  const orderIds = Object.keys(entities.orders).filter(orderId =>
    getByPathWithDefault([], 'shipments', entities.orders[orderId]).includes(shipmentId)
  );
  const handleClick = handleClickAndDoubleClick({
    clickId: entity,
    onClick: onTarget,
    onDoubleClick: onTarget,
    onCtrlClick: () =>
      // TODO: Check view form permissions
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
            <div ref={drag}>
              <Badge label={badge.shipment?.[shipmentId] || ''} />
              <ShipmentCard
                organizationId={shipment?.ownedBy}
                shipment={shipment}
                onViewForm={evt => {
                  evt.stopPropagation();
                  dispatch({
                    type: 'EDIT',
                    payload: {
                      type: SHIPMENT,
                      selectedId: shipmentId,
                      orderIds,
                    },
                  });
                }}
              />
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

      <div className={ContentStyle} />
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
  const orderItemIds = getByPathWithDefault([], 'orderItems', data)
    .map(item => getByPathWithDefault('', 'id', item))
    .filter(Boolean);
  const orderId = getByPathWithDefault('', 'id', data);
  const batchIds = flatten(
    getByPathWithDefault([], 'orderItems', data).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch => getByPathWithDefault('', 'id', batch))
    )
  ).filter(Boolean);
  const selected = orderItemIds.some(itemId => state.targets.includes(`${ORDER_ITEM}-${itemId}`));
  const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
  const isTargetedAnyItems = orderItemIds.some(itemId =>
    state.targets.includes(`${ORDER_ITEM}-${itemId}`)
  );
  const isTargetedAnyBatches = batchIds.some(batchId =>
    state.targets.includes(`${BATCH}-${batchId}`)
  );
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
            isTargeted={isExpand ? false : isTargetedOrder && isTargetedAnyItems}
            hasRelation={isExpand ? false : isTargetedOrder}
            type={beforeConnector}
          />
        )}
      </div>

      <CellWrapper isExpandedHeading={isExpand}>
        <OrderItemHeading
          orderItems={data?.orderItems || []}
          hasSelectedChildren={selected}
          hasFilterHits={isMatched}
          isExpanded={isExpand}
          onClick={onClick}
          total={data?.orderItemCount || 0}
          onSelectAll={() => {
            const targets = (data?.orderItems || []).map(item => `${ORDER_ITEM}-${item?.id}`);
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
            isTargeted={isExpand ? false : isTargetedAnyItems && isTargetedAnyBatches}
            hasRelation={isExpand ? false : isTargetedAnyBatches}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function BatchSummaryCell({
  data,
  onClick,
  order,
  isExpand,
  beforeConnector,
  afterConnector,
}: CellProps & { order: OrderPayload, isExpand: boolean, onClick: Function }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { matches } = Hits.useContainer();
  const orderItemIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item => getByPathWithDefault('', 'id', item))
  ).filter(Boolean);
  const batchIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch => getByPathWithDefault('', 'id', batch))
    )
  ).filter(Boolean);
  const isTargetedAnyItems = orderItemIds.some(itemId =>
    state.targets.includes(`${ORDER_ITEM}-${itemId}`)
  );
  const isTargetedAnyBatches = batchIds.some(batchId =>
    state.targets.includes(`${BATCH}-${batchId}`)
  );
  const containerCount = getByPathWithDefault(0, 'containerCount', order);
  const containerIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch =>
        getByPathWithDefault('', 'container.id', batch)
      )
    )
  ).filter(Boolean);
  const shipmentIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch =>
        getByPathWithDefault('', 'shipment.id', batch)
      )
    )
  ).filter(Boolean);
  const isTargetedAnyShipments = shipmentIds.some(batchId =>
    state.targets.includes(`${SHIPMENT}-${batchId}`)
  );
  const isTargetedAnyContainers = containerIds.some(containerId =>
    state.targets.includes(`${CONTAINER}-${containerId}`)
  );
  const isTargeted = containerCount
    ? isTargetedAnyBatches && isTargetedAnyContainers
    : isTargetedAnyBatches && isTargetedAnyShipments;
  const hasRelation = containerCount
    ? isTargetedAnyBatches && isTargetedAnyContainers
    : isTargetedAnyBatches && isTargetedAnyShipments;
  const total = getByPathWithDefault(0, 'batchCount', data);
  const isMatched = batchIds.some(itemId => matches.entity && matches.entity[`${itemId}-${BATCH}`]);
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isExpand ? false : isTargetedAnyItems && isTargetedAnyBatches}
            hasRelation={isExpand ? false : isTargetedAnyBatches}
            type={beforeConnector}
          />
        )}
      </div>

      {total ? (
        <CellWrapper isExpandedHeading={isExpand}>
          <BatchHeading
            batches={(data?.orderItems || []).flatMap(orderItem => orderItem?.batches) || []}
            hasSelectedChildren={isTargetedAnyBatches}
            hasFilterHits={isMatched}
            isExpanded={isExpand}
            onClick={onClick}
            total={data?.batchCount || 0}
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
            isTargeted={isExpand ? false : isTargeted}
            hasRelation={isExpand ? false : hasRelation}
            type={afterConnector}
          />
        )}
      </div>
    </>
  );
}

function ContainerSummaryCell({
  data,
  onClick,
  order,
  isExpand,
  beforeConnector,
  afterConnector,
}: CellProps & { order: OrderPayload, isExpand: boolean, onClick: Function }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { matches } = Hits.useContainer();
  const containerCount = getByPathWithDefault(0, 'containerCount', order);
  const batchIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch => getByPathWithDefault('', 'id', batch))
    )
  ).filter(Boolean);
  const containerIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch =>
        getByPathWithDefault('', 'container.id', batch)
      )
    )
  ).filter(Boolean);
  const shipmentIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch =>
        getByPathWithDefault('', 'shipment.id', batch)
      )
    )
  ).filter(Boolean);
  const isTargetedAnyBatches = batchIds.some(batchId =>
    state.targets.includes(`${BATCH}-${batchId}`)
  );
  const isTargetedAnyShipments = shipmentIds.some(batchId =>
    state.targets.includes(`${SHIPMENT}-${batchId}`)
  );
  const isTargetedAnyContainers = containerIds.some(containerId =>
    state.targets.includes(`${CONTAINER}-${containerId}`)
  );
  const beforeLine = {
    isTargeted: containerCount
      ? isTargetedAnyBatches && isTargetedAnyContainers
      : isTargetedAnyBatches && isTargetedAnyShipments,
    hasRelation: containerCount
      ? isTargetedAnyBatches && isTargetedAnyContainers
      : isTargetedAnyBatches && isTargetedAnyShipments,
  };
  const afterLine = {
    isTargeted: containerCount
      ? isTargetedAnyContainers && isTargetedAnyShipments
      : isTargetedAnyShipments && isTargetedAnyBatches,
    hasRelation: isTargetedAnyShipments,
  };
  const isMatched = containerIds.some(
    itemId => matches.entity && matches.entity[`${itemId}-${CONTAINER}`]
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
        const total = getByPathWithDefault(0, 'containerCount', data);
        const shipmentCount = getByPathWithDefault(0, 'shipmentCount', data);
        if (total) {
          return (
            <CellWrapper isExpandedHeading={isExpand}>
              <ContainerHeading
                containers={data?.containers || []}
                hasSelectedChildren={isTargetedAnyContainers}
                hasFilterHits={isMatched}
                isExpanded={isExpand}
                onClick={onClick}
                total={data?.containerCount || 0}
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

        if (shipmentCount) {
          return (
            <div style={{ width: CONTAINER_WIDTH }} className={ContentStyle}>
              <RelationLine
                isTargeted={isTargetedAnyShipments && isTargetedAnyBatches}
                hasRelation={isTargetedAnyShipments && isTargetedAnyBatches}
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

function ShipmentSummaryCell({
  data,
  onClick,
  order,
  isExpand,
  beforeConnector,
}: CellProps & { order: OrderPayload, isExpand: boolean, onClick: Function }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { matches } = Hits.useContainer();
  const containerCount = getByPathWithDefault(0, 'containerCount', order);
  const batchIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch => getByPathWithDefault('', 'id', batch))
    )
  ).filter(Boolean);
  const containerIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch =>
        getByPathWithDefault('', 'container.id', batch)
      )
    )
  ).filter(Boolean);
  const shipmentIds = flatten(
    getByPathWithDefault([], 'orderItems', order).map(item =>
      getByPathWithDefault([], 'batches', item).map(batch =>
        getByPathWithDefault('', 'shipment.id', batch)
      )
    )
  ).filter(Boolean);
  const isTargetedAnyBatches = batchIds.some(batchId =>
    state.targets.includes(`${BATCH}-${batchId}`)
  );
  const isTargetedAnyContainers = containerIds.some(containerId =>
    state.targets.includes(`${CONTAINER}-${containerId}`)
  );
  const isTargetedAnyShipments = shipmentIds.some(batchId =>
    state.targets.includes(`${SHIPMENT}-${batchId}`)
  );
  const beforeLine = {
    isTargeted: containerCount
      ? isTargetedAnyContainers && isTargetedAnyShipments
      : isTargetedAnyBatches && isTargetedAnyShipments,
    hasRelation: containerCount
      ? isTargetedAnyContainers && isTargetedAnyShipments
      : isTargetedAnyBatches && isTargetedAnyShipments,
  };
  const isMatched = shipmentIds.some(
    itemId => matches.entity && matches.entity[`${itemId}-${SHIPMENT}`]
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
        const total = getByPathWithDefault(0, 'shipmentCount', data);
        if (total) {
          return (
            <CellWrapper isExpandedHeading={isExpand}>
              <ShipmentHeading
                shipments={data?.shipments || []}
                hasSelectedChildren={isTargetedAnyShipments}
                hasFilterHits={isMatched}
                isExpanded={isExpand}
                onClick={onClick}
                total={data?.shipmentCount || 0}
                onSelectAll={() => {
                  const targets = [];

                  shipmentIds.forEach(id => targets.push(`${SHIPMENT}-${id}`));

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

        return <div style={{ width: SHIPMENT_WIDTH }} className={ContentStyle} />;
      })()}

      <div className={ContentStyle} />
    </>
  );
}

function DuplicateOrderCell({
  data,
  // $FlowIssue: doesn't support to access to child yet
  order,
  beforeConnector,
  afterConnector,
}: CellProps & { order: OrderPayload }) {
  const { state } = FocusedView.useContainer();
  const { getRelatedBy } = Entities.useContainer();
  const { getItemsSortByOrderId } = ClientSorts.useContainer();
  const orderId = order?.id;
  const itemPosition = data?.itemPosition ?? 0;
  const batchPosition = data?.batchPosition ?? 0;
  const originalItems = order?.orderItems ?? [];
  const items = getItemsSortByOrderId({ id: orderId, orderItems: originalItems, getRelatedBy });
  const itemList = [];
  if (items.length !== originalItems.length) {
    items.forEach(itemId => {
      if (!itemList.includes(itemId)) {
        const relatedItems = getRelatedBy('orderItem', itemId);
        itemList.push(itemId);
        if (relatedItems.length) {
          itemList.push(...relatedItems);
        }
      }
    });
    originalItems
      .map(item => item.id)
      .forEach(itemId => {
        if (!itemList.includes(itemId)) {
          const relatedItems = getRelatedBy('orderItem', itemId);
          itemList.push(itemId);
          if (relatedItems.length) {
            itemList.push(...relatedItems);
          }
        }
      });
  } else {
    itemList.push(...items);
  }

  let foundPosition = -1;
  for (let index = itemList.length - 1; index > 0; index -= 1) {
    const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${itemList[index]}`);
    if (isTargetedItem) {
      foundPosition = index;
      break;
    }
  }
  const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);

  const connector = {
    isTargeted:
      isTargetedOrder &&
      (foundPosition > itemPosition || (batchPosition === 0 && foundPosition === itemPosition)),
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
          width: ORDER_WIDTH,
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

function DuplicateOrderItemCell({ data, beforeConnector, afterConnector }: CellProps) {
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
          width: ORDER_ITEM_WIDTH,
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
    order,
  }: {
    onClick: Function,
    isExpand: boolean,
    order: OrderPayload,
  }
) => {
  if (!cell)
    return (
      <div
        style={{
          display: 'flex',
          width: ORDER_WIDTH + 20,
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
      const PlaceHolder = React.Fragment;
      content = (
        <div className={ContentStyle}>
          <BaseCard icon={icon} color={color}>
            <PlaceHolder>
              <LoadingIcon />
            </PlaceHolder>
          </BaseCard>
        </div>
      );
      break;
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
          order={order}
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
          order={order}
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
          order={order}
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
          order={order}
          onClick={onClick}
          isExpand={isExpand}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case 'shipmentSummary': {
      content = (
        <ShipmentSummaryCell
          data={data}
          order={order}
          onClick={onClick}
          isExpand={isExpand}
          beforeConnector={beforeConnector}
        />
      );

      break;
    }
    case 'duplicateOrder': {
      content = (
        <DuplicateOrderCell
          data={data}
          order={order}
          beforeConnector={beforeConnector}
          afterConnector={afterConnector}
        />
      );
      break;
    }
    case 'duplicateOrderItem': {
      content = (
        <DuplicateOrderItemCell
          data={data}
          order={order}
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
