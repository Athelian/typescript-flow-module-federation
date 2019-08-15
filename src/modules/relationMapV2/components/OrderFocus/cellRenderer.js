/* eslint-disable react/no-unused-prop-types */
// @flow
import * as React from 'react';
import type { OrderPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { flatten } from 'lodash';
import { uuid } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import BaseCard from 'components/Cards';
import {
  ORDER,
  ORDER_ITEM,
  BATCH,
  CONTAINER,
  SHIPMENT,
  ORDER_WIDTH,
  BATCH_WIDTH,
  ORDER_ITEM_WIDTH,
  CONTAINER_WIDTH,
  SHIPMENT_WIDTH,
} from 'modules/relationMapV2/constants';
import type { CellRender } from './type.js.flow';
import type { LINE_CONNECTOR } from '../RelationLine';
import RelationLine from '../RelationLine';
import { ContentStyle } from './style';
import {
  getColorByEntity,
  getIconByEntity,
  getCardByEntity,
  OrderCard,
  ItemCard,
  BatchCard,
  ShipmentCard,
  ContainerCard,
  HeaderCard,
} from './helpers';
import { RelationMapContext } from './store';

type CellProps = {
  data: Object,
  beforeConnector?: ?LINE_CONNECTOR,
  afterConnector?: ?LINE_CONNECTOR,
};

function OrderCell({ data, afterConnector }: CellProps) {
  const { state, dispatch } = React.useContext(RelationMapContext);
  const onTargetTree = () => {
    const targets = [`${ORDER}-${getByPathWithDefault('', 'id', data)}`];
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
      type: 'TARGET_ALL',
      payload: {
        targets,
      },
    });
  };
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity: `${ORDER}-${getByPathWithDefault('', 'id', data)}`,
      },
    });
  };
  const orderId = getByPathWithDefault('', 'id', data);
  const orderItemIds = flatten(
    getByPathWithDefault([], 'orderItems', data).map(item => getByPathWithDefault('', 'id', item))
  ).filter(Boolean);
  const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
  const isTargetedAnyItems = orderItemIds.some(itemId =>
    state.targets.includes(`${ORDER_ITEM}-${itemId}`)
  );

  const isTargeted = isTargetedOrder && isTargetedAnyItems;
  const hasRelation = isTargetedAnyItems;
  return (
    <>
      <div className={ContentStyle} />
      <div className={ContentStyle}>
        <BaseCard
          icon="ORDER"
          color="ORDER"
          isArchived={getByPathWithDefault(false, 'archived', data)}
          selected={state.targets.includes(`${ORDER}-${getByPathWithDefault('', 'id', data)}`)}
          selectable
          onDoubleClick={onTargetTree}
          onClick={onTarget}
        >
          <OrderCard>{getByPathWithDefault('', 'poNo', data)}</OrderCard>
        </BaseCard>
      </div>
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
  const { state, dispatch } = React.useContext(RelationMapContext);
  const orderId = getByPathWithDefault('', 'id', order);
  const itemId = getByPathWithDefault('', 'id', data);
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
    targets.push(`${ORDER_ITEM}-${getByPathWithDefault('', 'id', data)}`);
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
      type: 'TARGET_ALL',
      payload: {
        targets,
      },
    });
  };
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity: `${ORDER_ITEM}-${getByPathWithDefault('', 'id', data)}`,
      },
    });
  };
  // NOTE: try to test the click and double click without timeout
  // const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onTarget, onTargetTree);
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
      <div className={ContentStyle}>
        <BaseCard
          icon="ORDER_ITEM"
          color="ORDER_ITEM"
          isArchived={getByPathWithDefault(false, 'archived', data)}
          selected={state.targets.includes(`${ORDER_ITEM}-${getByPathWithDefault('', 'id', data)}`)}
          selectable
          onDoubleClick={onTargetTree}
          onClick={onTarget}
        >
          <ItemCard>{getByPathWithDefault('', 'no', data)}</ItemCard>
        </BaseCard>
      </div>
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
  const { state, dispatch } = React.useContext(RelationMapContext);
  const batchId = getByPathWithDefault('', 'id', data);
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
    targets.push(`${BATCH}-${getByPathWithDefault('', 'id', data)}`);
    if (data.container) {
      targets.push(`${CONTAINER}-${getByPathWithDefault('', 'container.id', data)}`);
    }
    if (data.shipment) {
      targets.push(`${SHIPMENT}-${getByPathWithDefault('', 'shipment.id', data)}`);
    }
    dispatch({
      type: 'TARGET_ALL',
      payload: {
        targets,
      },
    });
  };
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity: `${BATCH}-${getByPathWithDefault('', 'id', data)}`,
      },
    });
  };
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
      <div className={ContentStyle}>
        <BaseCard
          icon="BATCH"
          color="BATCH"
          isArchived={getByPathWithDefault(false, 'archived', data)}
          selected={state.targets.includes(`${BATCH}-${getByPathWithDefault('', 'id', data)}`)}
          selectable
          onDoubleClick={onTargetTree}
          onClick={onTarget}
        >
          <BatchCard>{getByPathWithDefault('', 'no', data)}</BatchCard>
        </BaseCard>
      </div>
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
  const { state, dispatch } = React.useContext(RelationMapContext);
  const containerId = getByPathWithDefault('', 'id', data);
  const isTargetedContainer = state.targets.includes(`${CONTAINER}-${containerId}`);
  const isTargetedBatch = state.targets.includes(
    `${BATCH}-${getByPathWithDefault('', 'relatedBatch.id', data)}`
  );
  const isTargetedShipment = state.targets.includes(
    `${SHIPMENT}-${getByPathWithDefault('', 'relatedBatch.shipment.id', data)}`
  );
  const onTargetTree = () => {
    const targets = [];
    targets.push(`${CONTAINER}-${getByPathWithDefault('', 'id', data)}`);
    if (data.relatedBatch && data.relatedBatch.shipment) {
      targets.push(`${SHIPMENT}-${getByPathWithDefault('', 'relatedBatch.shipment.id', data)}`);
    }
    dispatch({
      type: 'TARGET_ALL',
      payload: {
        targets,
      },
    });
  };
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity: `${CONTAINER}-${getByPathWithDefault('', 'id', data)}`,
      },
    });
  };
  return (
    <>
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            isTargeted={isTargetedContainer && isTargetedBatch}
            hasRelation={isTargetedContainer && isTargetedBatch}
            type={beforeConnector}
          />
        )}
      </div>
      <div className={ContentStyle}>
        <BaseCard
          icon="CONTAINER"
          color="CONTAINER"
          isArchived={getByPathWithDefault(false, 'archived', data)}
          selected={state.targets.includes(`${CONTAINER}-${getByPathWithDefault('', 'id', data)}`)}
          selectable
          onDoubleClick={onTargetTree}
          onClick={onTarget}
        >
          <ContainerCard>{getByPathWithDefault('', 'no', data)}</ContainerCard>
        </BaseCard>
      </div>
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
  const { state, dispatch } = React.useContext(RelationMapContext);
  const shipmentId = getByPathWithDefault('', 'id', data);
  const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipmentId}`);
  const isTargetedRelateEntity = getByPathWithDefault(null, 'relatedBatch.container', data)
    ? state.targets.includes(
        `${CONTAINER}-${getByPathWithDefault('', 'relatedBatch.container.id', data)}`
      )
    : state.targets.includes(`${BATCH}-${getByPathWithDefault('', 'relatedBatch.id', data)}`);
  const onTarget = () => {
    dispatch({
      type: 'TARGET',
      payload: {
        entity: `${SHIPMENT}-${getByPathWithDefault('', 'id', data)}`,
      },
    });
  };
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
      <div className={ContentStyle}>
        <BaseCard
          icon="SHIPMENT"
          color="SHIPMENT"
          isArchived={getByPathWithDefault(false, 'archived', data)}
          selected={state.targets.includes(`${SHIPMENT}-${getByPathWithDefault('', 'id', data)}`)}
          selectable
          onDoubleClick={onTarget}
          onClick={onTarget}
        >
          <ShipmentCard>{getByPathWithDefault('', 'blNo', data)}</ShipmentCard>
        </BaseCard>
      </div>
      <div className={ContentStyle} />
    </>
  );
}

function NoContainerCell({ data, beforeConnector, afterConnector }: CellProps) {
  const { state } = React.useContext(RelationMapContext);
  const isTargetedBatch = state.targets.includes(
    `${BATCH}-${getByPathWithDefault('', 'relatedBatch.id', data)}`
  );
  const isTargetedShipment = state.targets.includes(
    `${SHIPMENT}-${getByPathWithDefault('', 'relatedBatch.shipment.id', data)}`
  );
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
      <div style={{ width: CONTAINER_WIDTH - 20 }} className={ContentStyle}>
        <RelationLine
          isTargeted={isTargetedBatch && isTargetedShipment}
          hasRelation={isTargetedBatch && isTargetedShipment}
          type="HORIZONTAL"
        />
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
  const { state, dispatch } = React.useContext(RelationMapContext);
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
      <div className={ContentStyle} role="presentation">
        <HeaderCard isExpand={isExpand} selected={!isExpand && selected} onClick={onClick}>
          <ItemCard>
            <p>Total: {getByPathWithDefault(0, 'orderItemCount', data)}</p>
            <button
              type="button"
              onClick={evt => {
                evt.stopPropagation();
                const itemIds = flatten(
                  getByPathWithDefault([], `order.${orderId}.orderItems`, state).map(item =>
                    getByPathWithDefault('', 'id', item)
                  )
                ).filter(Boolean);
                const targets = itemIds.map(id => `${ORDER_ITEM}-${id}`);
                dispatch({
                  type: 'TARGET_ALL',
                  payload: {
                    targets,
                  },
                });
              }}
            >
              <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
            </button>
          </ItemCard>
        </HeaderCard>
      </div>
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
  const { state, dispatch } = React.useContext(RelationMapContext);
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
        <div className={ContentStyle}>
          <HeaderCard
            isExpand={isExpand}
            selected={!isExpand && isTargetedAnyBatches}
            onClick={onClick}
          >
            <BatchCard>
              <p>Total: {getByPathWithDefault(0, 'batchCount', data)}</p>
              <button
                type="button"
                onClick={evt => {
                  evt.stopPropagation();
                  const targets = [];
                  batchIds.forEach(id => targets.push(`${BATCH}-${id}`));
                  dispatch({
                    type: 'TARGET_ALL',
                    payload: {
                      targets,
                    },
                  });
                }}
              >
                <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
              </button>
            </BatchCard>
          </HeaderCard>
        </div>
      ) : (
        <div
          style={{
            width: BATCH_WIDTH - 20,
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
  const { state, dispatch } = React.useContext(RelationMapContext);
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
            <div className={ContentStyle}>
              <HeaderCard
                isExpand={isExpand}
                selected={!isExpand && isTargetedAnyContainers}
                onClick={onClick}
              >
                <ContainerCard>
                  <p>Total: {getByPathWithDefault(0, 'containerCount', data)}</p>
                  <button
                    type="button"
                    onClick={evt => {
                      evt.stopPropagation();
                      const targets = [];
                      containerIds.forEach(id => targets.push(`${CONTAINER}-${id}`));
                      dispatch({
                        type: 'TARGET_ALL',
                        payload: {
                          targets,
                        },
                      });
                    }}
                  >
                    <FormattedMessage
                      id="components.button.SelectAll"
                      defaultMessage="SELECT ALL"
                    />
                  </button>
                </ContainerCard>
              </HeaderCard>
            </div>
          );
        }

        if (shipmentCount) {
          return (
            <div style={{ width: CONTAINER_WIDTH - 20 }} className={ContentStyle}>
              <RelationLine
                isTargeted={isTargetedAnyShipments && isTargetedAnyBatches}
                hasRelation={isTargetedAnyShipments && isTargetedAnyBatches}
                type="HORIZONTAL"
              />
            </div>
          );
        }

        return <div style={{ width: CONTAINER_WIDTH - 20 }} className={ContentStyle} />;
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
  const { state, dispatch } = React.useContext(RelationMapContext);
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
            <div className={ContentStyle} role="presentation">
              <HeaderCard
                isExpand={isExpand}
                selected={!isExpand && isTargetedAnyShipments}
                selectable
                onClick={onClick}
              >
                <ShipmentCard>
                  <p>Total {getByPathWithDefault(0, 'shipmentCount', data)}</p>
                  <button
                    type="button"
                    onClick={evt => {
                      evt.stopPropagation();
                      const targets = [];
                      shipmentIds.forEach(id => targets.push(`${SHIPMENT}-${id}`));
                      dispatch({
                        type: 'TARGET_ALL',
                        payload: {
                          targets,
                        },
                      });
                    }}
                  >
                    <FormattedMessage
                      id="components.button.SelectAll"
                      defaultMessage="SELECT ALL"
                    />
                  </button>
                </ShipmentCard>
              </HeaderCard>
            </div>
          );
        }

        return <div style={{ width: SHIPMENT_WIDTH - 20 }} className={ContentStyle} />;
      })()}

      <div className={ContentStyle} />
    </>
  );
}

function DuplicateOrderCell({
  data,
  order,
  beforeConnector,
  afterConnector,
}: CellProps & { order: OrderPayload }) {
  const { state } = React.useContext(RelationMapContext);
  const itemPosition = getByPathWithDefault(0, 'itemPosition', data);
  const items = getByPathWithDefault('', 'orderItems', order);
  let foundPosition = -1;
  for (let index = items.length - 1; index > 0; index -= 1) {
    const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${items[index].id}`);
    if (isTargetedItem) {
      foundPosition = index;
      break;
    }
  }
  const isTargetedOrder = state.targets.includes(
    `${ORDER}-${getByPathWithDefault('', 'id', order)}`
  );
  const connector = {
    isTargeted: isTargetedOrder && foundPosition >= itemPosition,
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
          width: ORDER_WIDTH - 20,
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

function DuplicateOrderItemCell({
  data,
  order,
  beforeConnector,
  afterConnector,
}: CellProps & { order: OrderPayload }) {
  const { state } = React.useContext(RelationMapContext);
  const itemId = getByPathWithDefault(
    '',
    `orderItems.${getByPathWithDefault(0, 'itemPosition', data)}.id`,
    order
  );
  const batchPosition = getByPathWithDefault(0, 'batchPosition', data);
  const batches = getByPathWithDefault(
    '',
    `orderItems.${getByPathWithDefault(0, 'itemPosition', data)}.batches`,
    order
  );
  let foundPosition = -1;
  for (let index = batches.length - 1; index > 0; index -= 1) {
    const isTargetedBatch = state.targets.includes(`${BATCH}-${batches[index].id}`);
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
          width: ORDER_ITEM_WIDTH - 20,
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
          width: ORDER_WIDTH,
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
      const PlaceHolder = getCardByEntity(entity);
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
      content = <div className={ContentStyle}>{type} </div>;
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
