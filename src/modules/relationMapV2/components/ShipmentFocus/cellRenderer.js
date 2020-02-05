/* eslint-disable react/no-unused-prop-types */
// @flow
import * as React from 'react';
import type { ShipmentPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { useDrop, useDrag } from 'react-dnd';
import { uuid } from 'utils/id';
import { useEntityHasPermissions, useHasPermissions } from 'contexts/Permissions';
import LoadingIcon from 'components/LoadingIcon';
import BaseCard from 'components/Cards';
import {
  ORDER,
  ORDER_ITEM,
  BATCH,
  BATCHES,
  CONTAINER,
  SHIPMENT,
  PRODUCT,
  ORDER_WIDTH,
  BATCH_WIDTH,
  CONTAINER_WIDTH,
  SHIPMENT_LONG_WIDTH,
} from 'modules/relationMapV2/constants';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { Hits, Entities, ClientSorts, FocusedView } from 'modules/relationMapV2/store';
import {
  getColorByEntity,
  getIconByEntity,
  handleClickAndDoubleClick,
  findParentIdsByBatch,
  getIdentifier,
  isMatchedEntity,
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
import DraggedPlaceholder from '../DraggedPlaceholder';
import CellDraggable from '../CellDraggable';
import DroppableOverlay from '../DroppableOverlay';
import { ContentStyle } from './style';
import {
  orderDropMessage,
  orderItemDropMessage,
  containerDropMessage,
  shipmentDropMessage,
  hasPermissionToMove,
} from './messages';

type CellProps = {
  data: Object,
  beforeConnector?: ?LINE_CONNECTOR,
  afterConnector?: ?LINE_CONNECTOR,
};

function OrderCell({ data, beforeConnector }: CellProps) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const order = data?.orderItem?.order;
  const hasPermissions = useEntityHasPermissions(data);
  const orderId = order?.id;
  const itemId = data?.orderItem?.id;
  const [{ isOver, canDrop, dropMessage }, drop] = useDrop({
    accept: [BATCH, ORDER_ITEM],
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item.id;
          const [, parentOrderId] = findParentIdsByBatch({
            batchId,
            entities,
            viewer: state.viewer,
          });
          if (!parentOrderId) return false;

          const isOwnOrder = orderId === parentOrderId;
          const isDifferentImporter =
            entities?.orders?.[orderId]?.importer?.id !==
            entities?.orders?.[parentOrderId]?.importer?.id;
          const isDifferentExporter =
            entities?.orders?.[orderId]?.exporter?.id !==
            entities?.orders?.[parentOrderId]?.exporter?.id;
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
      isSameItem: monitor.getItem()?.id === orderId,
      dropMessage: orderDropMessage({
        hasPermissions,
        entities,
        orderId,
        item: monitor.getItem(),
      }),
    }),
  });
  const [, drag] = useDrag({
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
        <CellDraggable ref={drag}>
          <BaseCard
            icon="ORDER"
            color="ORDER"
            isArchived={order?.archived ?? false}
            selected={state.targets.includes(`${ORDER}-${orderId}`)}
            selectable={state.targets.includes(`${ORDER}-${orderId}`)}
            onClick={handleClick}
            flattenCornerIcon
            id={`${ORDER}-${orderId}`}
            showBadge={data?.notificationUnseenCount > 0}
          >
            <OrderCard
              organizationId={order?.ownedBy?.id}
              order={order}
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
          </BaseCard>

          <DroppableOverlay
            isDragging={state.isDragging}
            canDrop={canDrop}
            isOver={isOver}
            message={dropMessage}
          />
          <FilterHitBorder hasFilterHits={isMatchedEntity(matches, order)} />
          <Badge label={badge?.order?.[orderId] ?? ''} />
        </CellDraggable>
      </CellWrapper>

      <div className={ContentStyle} />
    </>
  );
}

function OrderItemCell({
  data,
  beforeConnector,
  afterConnector,
  shipment,
}: CellProps & { shipment: ?ShipmentPayload }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const hasPermissions = useEntityHasPermissions(data?.orderItem);
  const order = data?.orderItem?.order;
  const orderId = order?.id;
  const itemId = data?.orderItem?.id;
  const batches = (shipment?.batches ?? []).filter(batch => batch?.orderItem?.id === itemId);
  const [{ isOver, canDrop, dropMessage }, drop] = useDrop({
    accept: BATCH,
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item?.id;
          const [parentItemId, parentOrderId] = findParentIdsByBatch({
            batchId,
            entities,
            viewer: state.viewer,
          });
          if (!parentOrderId || !parentItemId) return false;

          const parentOrder = entities.orders?.[parentOrderId];
          const isOwnItem = parentItemId === itemId;
          const isDifferentImporter = order?.importer?.id !== parentOrder?.importer?.id;
          const isDifferentExporter = order?.exporter?.id !== parentOrder?.exporter?.id;
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
      isSameItem: monitor.getItem()?.id === itemId,
      dropMessage: orderItemDropMessage({
        hasPermissions,
        entities,
        order,
        itemId,
        item: monitor.getItem(),
      }),
    }),
  });
  const [, drag] = useDrag({
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
        <CellDraggable ref={drag}>
          <BaseCard
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            isArchived={data?.orderItem?.archived}
            selected={state.targets.includes(`${ORDER_ITEM}-${itemId}`)}
            selectable={state.targets.includes(`${ORDER_ITEM}-${itemId}`)}
            onClick={handleClick}
            flattenCornerIcon
            id={`${ORDER_ITEM}-${itemId}`}
            showBadge={data?.orderItem?.notificationUnseenCount > 0}
          >
            <OrderItemCard
              organizationId={data?.orderItem?.ownedBy?.id}
              orderItem={{ ...(data?.orderItem ?? {}), batches }}
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
                      no: data?.orderItem?.no,
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
                      no: data?.orderItem?.no,
                    },
                  },
                });
              }}
            />
          </BaseCard>

          <DroppableOverlay
            isDragging={state.isDragging}
            canDrop={canDrop}
            isOver={isOver}
            message={dropMessage}
          />
          <FilterHitBorder hasFilterHits={isMatchedEntity(matches, data?.orderItem)} />
          <Badge label={badge?.orderItem?.[itemId] ?? ''} />
        </CellDraggable>
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
  const { state, dispatch, selectors } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { matches } = Hits.useContainer();
  const batchId = data?.id;
  const batchIds = selectors.targetedBatchIds();
  const isTargetedBatch = selectors.isTargeted(batchId, BATCH);
  const belongToContainer = !!data?.container;
  const hasBatchPermissions = useHasPermissions(data?.ownedBy?.id);
  const selectedItem =
    isTargetedBatch && selectors.isDragMultiEntities(BATCH)
      ? { type: BATCHES, id: batchIds.join(',') }
      : { type: BATCH, id: batchId };
  const { entities } = mapping;
  const [{ isOver, canDrop, isSameItem }, drop] = useDrop({
    accept: [BATCH, ORDER_ITEM],
    canDrop: () => false,
    drop: () => selectedItem,
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isSameItem: monitor.getItem()?.id === batchId,
    }),
  });
  const [{ isDragging, draggingId }, drag] = useDrag({
    item: selectedItem,
    begin: () => {
      dispatch({
        type: 'START_DND',
      });
    },
    canDrag: () => {
      // TODO: check permission for multi drag and drop batches
      return hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        dispatch({
          type: 'DND',
          payload: {
            from:
              item?.type === BATCH
                ? getIdentifier({
                    ...item,
                    entities,
                  })
                : {
                    id: item?.id,
                    icon: 'BATCHES',
                    value: batchIds.length,
                  },
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
      draggingId: monitor.getItem()?.id,
    }),
  });

  const entity = `${BATCH}-${batchId}`;
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

  const showDraggingPlaceholder =
    isDragging ||
    (state.isDragging &&
      isTargetedBatch &&
      batchIds.join(',') === draggingId &&
      selectors.isDragMultiEntities(BATCH));

  const draggingCount =
    state.isDragging && isTargetedBatch && selectors.isDragMultiEntities(BATCH)
      ? batchIds.length
      : 1;

  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={
              isTargetedBatch && (isTargetedContainer || (!data?.container && isTargetedShipment))
            }
            hasRelation={isTargetedBatch}
            type={beforeConnector}
          >
            {belongToContainer && hasBatchPermissions([BATCH_UPDATE]) && (
              <RemoveButton
                offset
                onClick={() => {
                  dispatch({
                    type: 'REMOVE_BATCH',
                    payload: {
                      entity: {
                        id: data?.id,
                        no: data?.no,
                      },
                      from: {
                        type: 'CONTAINER',
                        id: data?.container?.id,
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
        <CellDraggable ref={drag}>
          <BaseCard
            icon="BATCH"
            color="BATCH"
            isArchived={data?.archived ?? false}
            selected={state.targets.includes(`${BATCH}-${batchId}`)}
            selectable={state.targets.includes(`${BATCH}-${batchId}`)}
            onClick={handleClick}
            flattenCornerIcon
            id={`${BATCH}-${batchId}`}
            showBadge={data?.notificationUnseenCount > 0}
          >
            <BatchCard
              organizationId={data?.ownedBy?.id}
              batch={data}
              container={entities.containers?.[data?.container?.id]}
              shipment={entities.shipments?.[data?.shipment?.id]}
              onViewForm={evt => {
                evt.stopPropagation();
                dispatch({
                  type: 'EDIT',
                  payload: {
                    type: BATCH,
                    selectedId: batchId,
                    shipmentId: shipment?.id,
                  },
                });
              }}
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
          </BaseCard>

          {showDraggingPlaceholder || isSameItem ? (
            <DraggedPlaceholder
              message={
                <FormattedMessage
                  id="modules.RelationMap.dnd.movingXBatches"
                  defaultMessage="Moving {draggingCount} {batchesLabel}"
                  values={{
                    draggingCount,
                    batchesLabel:
                      draggingCount > 1 ? (
                        <FormattedMessage id="modules.RelationMap.label.batches" />
                      ) : (
                        <FormattedMessage id="modules.RelationMap.label.batch" />
                      ),
                  }}
                />
              }
            />
          ) : (
            <>
              <DroppableOverlay
                isDragging={state.isDragging}
                canDrop={canDrop}
                isOver={isOver}
                message={
                  <FormattedMessage
                    id="modules.RelationMap.dnd.cannotMoveToBatch"
                    defaultMessage="Cannot Move to Batch"
                  />
                }
              />
              <FilterHitBorder hasFilterHits={isMatchedEntity(matches, data)} />
              <Badge label={badge?.batch?.[batchId] ?? ''} />
            </>
          )}
        </CellDraggable>
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
  const container = entities?.containers?.[containerId] ?? { id: containerId };
  const hasPermissions = useEntityHasPermissions(data);
  const batches = shipment?.batches ?? [];
  const shipmentId = shipment?.id ?? '';
  const [{ isOver, canDrop, dropMessage }, drop] = useDrop({
    accept: [BATCH, BATCHES, ORDER_ITEM],
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item?.id;
          const parentItemId = entities?.batches?.[batchId]?.orderItem;
          if (!parentItemId) return false;

          const parentOrderId = entities?.orderItems?.[parentItemId]?.order;
          if (!parentOrderId) return false;

          const batch = entities?.batches?.[batchId] ?? {};
          const order = entities?.orders?.[parentOrderId] ?? {};
          const isOwnContainer = batch?.container === containerId;
          const isDifferentImporter = shipment?.importer?.id !== order?.importer?.id;
          const isDifferentExporter =
            shipment?.exporter && shipment?.exporter?.id !== order?.exporter?.id;
          const noPermission = !hasPermissionToMove({
            hasPermissions,
            type: SHIPMENT,
          });
          return !isOwnContainer && !isDifferentImporter && !isDifferentExporter && !noPermission;
        }

        case BATCHES: {
          const batchIds = (item?.id ?? '').split(',');
          const containerIds = [
            ...new Set(
              batchIds
                .map(batchId => mapping?.entities?.batches?.[batchId]?.container)
                .filter(Boolean)
            ),
          ];
          const orderIds = [
            ...new Set(
              batchIds
                .map(batchId => {
                  const [, parentOrderId] = findParentIdsByBatch({
                    batchId,
                    viewer: state.viewer,
                    entities: mapping?.entities,
                  });
                  return parentOrderId;
                })
                .filter(Boolean)
            ),
          ];

          const importerIds = [];
          const exporterIds = [];
          orderIds.forEach(orderId => {
            const order = mapping?.entities?.orders?.[orderId];
            const importId = order?.importer?.id;
            const exporterId = order?.exporter?.id;
            if (importId && !importerIds.includes(importId)) {
              importerIds.push(importId);
            }
            if (exporterId && !exporterIds.includes(exporterId)) {
              exporterIds.push(exporterId);
            }
          });
          const isSameParent =
            containerIds.length === 1 &&
            containerIds.includes(container.id) &&
            batchIds.every(batchId => !!entities?.batches?.[batchId]?.container);
          const isDifferentImporter = !importerIds.includes(shipment?.importer?.id);
          const isDifferentExporter =
            (exporterIds.length === 1 &&
              !exporterIds.includes(shipment?.exporter?.id) &&
              shipment?.exporter?.id) ||
            (exporterIds.length > 1 && shipment?.exporter?.id);
          const noPermission = !hasPermissionToMove({
            hasPermissions,
            type: SHIPMENT,
          });
          const isInvalid =
            isSameParent || isDifferentImporter || isDifferentExporter || noPermission;
          return !isInvalid;
        }

        default:
          return false;
      }
    },
    drop: () => ({ type: CONTAINER, id: containerId }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isSameItem: monitor.getItem()?.id === containerId,
      dropMessage: containerDropMessage({
        hasPermissions,
        entities,
        containerId,
        item: monitor.getItem(),
      }),
    }),
  });
  const [, drag] = useDrag({
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
  const isTargetedAnyBatches = batches
    .filter(batch => containerId === batch?.container?.id)
    .some(batch => state.targets.includes(`${BATCH}-${batch?.id}`));
  const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipmentId}`);
  const entity = `${CONTAINER}-${containerId}`;
  const onTargetTree = () => {
    const targets = [];
    batches.forEach(batch => {
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
  const orderIds = Object.keys(entities?.orders ?? {}).filter(orderId =>
    (entities?.orders?.[orderId]?.shipments ?? []).includes(shipmentId)
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
            isTargeted={isTargetedContainer && isTargetedShipment}
            hasRelation={isTargetedContainer && isTargetedShipment}
            type={beforeConnector}
          />
        )}
      </div>

      <CellWrapper ref={drop}>
        <CellDraggable ref={drag}>
          <BaseCard
            icon="CONTAINER"
            color="CONTAINER"
            isArchived={entities?.containers?.[containerId]?.archived ?? false}
            selected={state.targets.includes(`${CONTAINER}-${containerId}`)}
            selectable={state.targets.includes(`${CONTAINER}-${containerId}`)}
            onClick={handleClick}
            flattenCornerIcon
            id={`${CONTAINER}-${containerId}`}
            showBadge={data?.notificationUnseenCount > 0}
          >
            <ContainerCard
              organizationId={data?.ownedBy?.id}
              container={data}
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
              onDeleteContainer={evt => {
                evt.stopPropagation();
                dispatch({
                  type: 'DELETE_CONTAINER',
                  payload: {
                    entity: {
                      id: containerId,
                      no: data?.no,
                    },
                  },
                });
              }}
            />
          </BaseCard>

          <DroppableOverlay
            isDragging={state.isDragging}
            canDrop={canDrop}
            isOver={isOver}
            message={dropMessage}
          />
          <FilterHitBorder hasFilterHits={isMatchedEntity(matches, data)} />
          <Badge label={badge?.container?.[containerId] ?? ''} />
        </CellDraggable>
      </CellWrapper>

      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            isTargeted={isTargetedContainer && isTargetedAnyBatches}
            hasRelation={isTargetedContainer && isTargetedAnyBatches}
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
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload }) {
  const { state, dispatch } = FocusedView.useContainer();
  const { mapping, badge } = Entities.useContainer();
  const { entities } = mapping;
  const { matches } = Hits.useContainer();
  const shipmentId = shipment?.id;
  const hasPermissions = useHasPermissions(shipment?.ownedBy?.id);
  const [{ isOver, canDrop, dropMessage }, drop] = useDrop({
    accept: [BATCH, BATCHES],
    canDrop: item => {
      const { type } = item;
      switch (type) {
        case BATCH: {
          const batchId = item?.id;
          const parentItemId = entities?.batches?.[batchId]?.orderItem;
          if (!parentItemId) return false;

          const parentOrderId = entities?.orderItems?.[parentItemId]?.order;
          if (!parentOrderId) return false;

          const batch = entities?.batches?.[batchId] ?? {};
          const order = entities?.orders?.[parentOrderId] ?? {};
          const isOwnShipment = batch?.shipment === shipmentId && !batch.container;
          const isDifferentImporter = shipment?.importer?.id !== order?.importer?.id;
          const isDifferentExporter =
            shipment?.exporter && shipment?.exporter?.id !== order?.exporter?.id;
          const noPermission = !hasPermissionToMove({
            hasPermissions,
            type: SHIPMENT,
          });
          return !isOwnShipment && !isDifferentImporter && !isDifferentExporter && !noPermission;
        }

        case BATCHES: {
          const batchIds = (item?.id ?? '').split(',');
          const shipmentIds = [
            ...new Set(
              batchIds
                .map(batchId => mapping?.entities?.batches?.[batchId]?.shipment)
                .filter(Boolean)
            ),
          ];
          const orderIds = [
            ...new Set(
              batchIds
                .map(batchId => {
                  const [, parentOrderId] = findParentIdsByBatch({
                    batchId,
                    viewer: state.viewer,
                    entities: mapping.entities,
                  });
                  return parentOrderId;
                })
                .filter(Boolean)
            ),
          ];

          const importerIds = [];
          const exporterIds = [];
          orderIds.forEach(orderId => {
            const order = mapping?.entities?.orders?.[orderId];
            const importId = order?.importer?.id;
            const exporterId = order?.exporter?.id;
            if (importId && !importerIds.includes(importId)) {
              importerIds.push(importId);
            }
            if (exporterId && !exporterIds.includes(exporterId)) {
              exporterIds.push(exporterId);
            }
          });
          const isSameParent =
            shipmentIds.length === 1 &&
            shipmentIds.includes(shipmentId) &&
            batchIds.every(batchId => !!entities?.batches?.[batchId]?.shipment);
          const isDifferentImporter = !importerIds.includes(shipment?.importer?.id);
          const isDifferentExporter =
            (exporterIds.length === 1 &&
              !exporterIds.includes(shipment?.exporter?.id) &&
              shipment?.exporter?.id) ||
            (exporterIds.length > 1 && shipment?.exporter?.id);
          const noPermission = !hasPermissionToMove({
            hasPermissions,
            type: SHIPMENT,
          });
          const isInvalid =
            isSameParent || isDifferentImporter || isDifferentExporter || noPermission;
          return !isInvalid;
        }

        default:
          return false;
      }
    },
    drop: () => ({ type: SHIPMENT, id: shipmentId }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isSameItem: monitor.getItem()?.id === shipmentId,
      dropMessage: shipmentDropMessage({
        hasPermissions,
        entities,
        shipmentId,
        item: monitor.getItem(),
      }),
    }),
  });
  const [, drag] = useDrag({
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
    ) ||
    (shipment?.batches ?? []).some(
      batch => !batch.container && state.targets.includes(`${BATCH}-${batch.id}`)
    );
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
    .map(batch => batch?.orderItem?.order?.id)
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
      <div className={ContentStyle} />

      <CellWrapper ref={drop}>
        <CellDraggable ref={drag}>
          <BaseCard
            icon="SHIPMENT"
            color="SHIPMENT"
            isArchived={shipment?.archived ?? false}
            selected={state.targets.includes(`${SHIPMENT}-${shipmentId}`)}
            selectable={state.targets.includes(`${SHIPMENT}-${shipmentId}`)}
            onClick={handleClick}
            flattenCornerIcon
            id={`${SHIPMENT}-${shipmentId}`}
            showBadge={shipment?.notificationUnseenCount > 0}
          >
            <ShipmentCard
              organizationId={shipment?.ownedBy?.id}
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
              onCreateContainer={evt => {
                evt.stopPropagation();
                dispatch({
                  type: 'CREATE_CONTAINER',
                  payload: {
                    entity: {
                      id: shipmentId,
                    },
                  },
                });
              }}
            />
          </BaseCard>

          <DroppableOverlay
            isDragging={state.isDragging}
            canDrop={canDrop}
            isOver={isOver}
            message={dropMessage}
          />
          <FilterHitBorder hasFilterHits={isMatchedEntity(matches, shipment)} />
          <Badge label={badge?.shipment?.[shipmentId] ?? ''} />
        </CellDraggable>
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
  const isTargetedBatch = state.targets.includes(`${BATCH}-${data?.relatedBatch?.id}`);
  const isTargetedShipment = state.targets.includes(
    `${SHIPMENT}-${data?.relatedBatch?.shipment?.id}`
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
  const batches = data?.batches ?? [];
  const orderItemIds = batches.map(batch => batch.orderItem?.id).filter(Boolean);
  const orderItems = batches.map(batch => batch.orderItem).filter(Boolean);
  const orderIds = batches.map(batch => batch.orderItem?.order?.id).filter(Boolean);
  const batchIds = batches.map(batch => batch.id).filter(Boolean);
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
          total={data?.orderItemCount ?? 0}
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
  const batches = shipment?.batches ?? [];
  const orderItemIds = batches.map(batch => batch.orderItem?.id).filter(Boolean);
  const batchIds = batches.map(batch => batch.id).filter(Boolean);
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
            batches={batches}
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
  const containers = shipment?.containers ?? [];
  const containerIds = containers.map(container => container?.id).filter(Boolean);
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
                containers={containers}
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
  const batches = shipment?.batches ?? [];
  const itemIds = batches.map(batch => batch.orderItem?.id).filter(Boolean);
  const orderIds = batches.map(batch => batch.orderItem?.order?.id).filter(Boolean);
  const isTargetedAnyItems = itemIds.some(itemId =>
    state.targets.includes(`${ORDER_ITEM}-${itemId}`)
  );
  const orders = [...new Set(batches.map(batch => batch.orderItem?.order).filter(Boolean))];
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
  data,
  // $FlowIgnore: does not support
  shipment,
  beforeConnector,
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload }) {
  const { state } = FocusedView.useContainer();
  const shipmentId = shipment?.id;
  const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipmentId}`);
  const { getRelatedBy } = Entities.useContainer();
  const { getContainersSortByShipmentId, getBatchesSortByShipmentId } = ClientSorts.useContainer();
  const containerPosition = data?.containerPosition ?? 0;
  const batchPosition = data?.batchPosition ?? 0;
  const originalContainers = shipment?.containers ?? [];
  const batches = shipment?.batches ?? [];
  const batchesWithoutContainers = batches.filter(batch => !batch?.container);
  const batchesList = getBatchesSortByShipmentId({
    id: shipment.id,
    batches: batchesWithoutContainers,
    getRelatedBy,
  }).filter(Boolean);

  let targetBatchOnPoolPosition = -1;
  for (let index = batchesList.length - 1; index >= 0; index -= 1) {
    const isTargetedBatch = state.targets.includes(`${BATCH}-${batchesList[index]}`);
    if (isTargetedBatch) {
      targetBatchOnPoolPosition = index;
      break;
    }
  }

  const containers = getContainersSortByShipmentId({
    id: shipmentId,
    containers: originalContainers,
    getRelatedBy,
  });
  const containerList = [];
  if (containers.length !== originalContainers.length) {
    containers.forEach(containerId => {
      if (!containerList.includes(containerId)) {
        const relatedContainers = getRelatedBy('container', containerId);
        containerList.push(containerId);
        if (relatedContainers.length) {
          containerList.push(...relatedContainers);
        }
      }
    });
    originalContainers
      .map(container => container.id)
      .forEach(containerId => {
        if (!containerList.includes(containerId)) {
          const relatedContainers = getRelatedBy('container', containerId);
          containerList.push(containerId);
          if (relatedContainers.length) {
            containerList.push(...relatedContainers);
          }
        }
      });
  } else {
    containerList.push(...containers);
  }

  let foundPosition = -1;
  for (let index = containerList.length - 1; index >= 0; index -= 1) {
    const isTargetedContainer = state.targets.includes(`${CONTAINER}-${containerList[index]}`);
    if (isTargetedContainer) {
      foundPosition = index;
      break;
    }
  }

  const highlightBatches =
    containerPosition === -1 &&
    ((targetBatchOnPoolPosition >= 0 && batchPosition <= targetBatchOnPoolPosition) ||
      foundPosition >= 0);
  const highlightContainers =
    (foundPosition > containerPosition ||
      (foundPosition === containerPosition && batchPosition <= 0)) &&
    containerPosition >= 0;
  const connector = {
    isTargeted: isTargetedShipment && (highlightBatches || highlightContainers),
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
          width: SHIPMENT_LONG_WIDTH,
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

function DuplicateContainerCell({
  data,
  // $FlowIgnore: does not support
  shipment,
  beforeConnector,
  afterConnector,
}: CellProps & { shipment: ?ShipmentPayload }) {
  const { state } = FocusedView.useContainer();
  const { getRelatedBy } = Entities.useContainer();
  const { getBatchesSortByContainerId } = ClientSorts.useContainer();
  const batchPosition = data?.batchPosition ?? 0;
  const containerId = data.container?.id;
  const originalBatches = (shipment?.batches ?? []).filter(
    batch => batch?.container?.id === containerId
  );
  const batchList = getBatchesSortByContainerId({
    id: containerId,
    batches: originalBatches,
    getRelatedBy,
  });

  let foundPosition = -1;
  for (let index = batchList.length - 1; index > 0; index -= 1) {
    const isTargetedBatch = state.targets.includes(`${BATCH}-${batchList[index]}`);
    if (isTargetedBatch) {
      foundPosition = index;
      break;
    }
  }

  const isTargetedContainer = state.targets.includes(`${CONTAINER}-${containerId}`);

  const connector = {
    isTargeted: isTargetedContainer && foundPosition >= batchPosition,
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
    case 'containerPlaceholder': {
      return (
        <div
          style={{
            display: 'flex',
            width: CONTAINER_WIDTH + 20,
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
      key={`${cell?.data?.id ?? uuid()}-${type}`}
    >
      {content}
    </div>
  );
};

export default cellRenderer;
