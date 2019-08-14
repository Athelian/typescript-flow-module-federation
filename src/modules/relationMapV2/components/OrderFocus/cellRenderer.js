// @flow
import * as React from 'react';
import type { OrderPayload } from 'generated/graphql';
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
import type { CellRender, State } from './type.js.flow';
import RelationLine from '../RelationLine';
import { useClickPreventionOnDoubleClick } from './hooks';
import { ContentStyle } from './style';
import {
  getColorByEntity,
  getIconByEntity,
  getCardByEntity,
  findLineColors,
  OrderCard,
  ItemCard,
  BatchCard,
  ShipmentCard,
  ContainerCard,
} from './helpers';

function OrderCell({ data, state, dispatch }: { data: Object, state: State, dispatch: Function }) {
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
      type: 'TARGET_TREE',
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
  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onTarget, onTargetTree);
  return (
    <div className={ContentStyle}>
      <BaseCard
        icon="ORDER"
        color="ORDER"
        isArchived={getByPathWithDefault(false, 'archived', data)}
        selected={state.targets.includes(`${ORDER}-${getByPathWithDefault('', 'id', data)}`)}
        selectable
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        <OrderCard>{getByPathWithDefault('', 'poNo', data)}</OrderCard>
      </BaseCard>
    </div>
  );
}

function OrderItemCell({
  data,
  state,
  dispatch,
}: {
  data: Object,
  state: State,
  dispatch: Function,
}) {
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
      type: 'TARGET_TREE',
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
  );
}

function BatchCell({ data, state, dispatch }: { data: Object, state: State, dispatch: Function }) {
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
      type: 'TARGET_TREE',
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
  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onTarget, onTargetTree);
  return (
    <div className={ContentStyle}>
      <BaseCard
        icon="BATCH"
        color="BATCH"
        isArchived={getByPathWithDefault(false, 'archived', data)}
        selected={state.targets.includes(`${BATCH}-${getByPathWithDefault('', 'id', data)}`)}
        selectable
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        <BatchCard>{getByPathWithDefault('', 'no', data)}</BatchCard>
      </BaseCard>
    </div>
  );
}

function ContainerCell({
  data,
  state,
  dispatch,
}: {
  data: Object,
  state: State,
  dispatch: Function,
}) {
  const onTargetTree = () => {
    const targets = [];
    targets.push(`${CONTAINER}-${getByPathWithDefault('', 'id', data)}`);
    if (data.relatedBatch && data.relatedBatch.shipment) {
      targets.push(`${SHIPMENT}-${getByPathWithDefault('', 'relatedBatch.shipment.id', data)}`);
    }
    dispatch({
      type: 'TARGET_TREE',
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
  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onTarget, onTargetTree);
  return (
    <div className={ContentStyle}>
      <BaseCard
        icon="CONTAINER"
        color="CONTAINER"
        isArchived={getByPathWithDefault(false, 'archived', data)}
        selected={state.targets.includes(`${CONTAINER}-${getByPathWithDefault('', 'id', data)}`)}
        selectable
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        <ContainerCard>{getByPathWithDefault('', 'no', data)}</ContainerCard>
      </BaseCard>
    </div>
  );
}

const cellRenderer = (
  cell: ?CellRender,
  {
    onClick,
    isExpand,
    dispatch,
    state,
    order,
  }: {
    onClick: Function,
    dispatch: Function,
    isExpand: boolean,
    state: State,
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
      content = <OrderCell data={data} state={state} dispatch={dispatch} />;
      break;
    }
    case ORDER_ITEM: {
      content = <OrderItemCell data={data} state={state} dispatch={dispatch} />;
      break;
    }
    case BATCH: {
      content = <BatchCell data={data} state={state} dispatch={dispatch} />;
      break;
    }
    case SHIPMENT:
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="SHIPMENT"
            color="SHIPMENT"
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(`${SHIPMENT}-${getByPathWithDefault('', 'id', data)}`)}
            selectable
            onClick={() =>
              dispatch({
                type: 'TARGET',
                payload: {
                  entity: `${SHIPMENT}-${getByPathWithDefault('', 'id', data)}`,
                },
              })
            }
          >
            <ShipmentCard>{getByPathWithDefault('', 'blNo', data)}</ShipmentCard>
          </BaseCard>
        </div>
      );
      break;
    case 'shipmentWithoutContainer':
      content = (
        <div style={{ width: CONTAINER_WIDTH - 20 }} className={ContentStyle}>
          <RelationLine
            {...findLineColors({
              position: 'center',
              isExpand,
              type,
              state,
              cell,
              order,
            })}
            type="HORIZONTAL"
          />
        </div>
      );
      break;
    case CONTAINER: {
      content = <ContainerCell data={data} state={state} dispatch={dispatch} />;
      break;
    }
    case 'itemSummary': {
      const orderItemIds = getByPathWithDefault([], 'data.orderItems', cell).map(item =>
        getByPathWithDefault('', 'id', item)
      );
      const selected = orderItemIds.some(itemId =>
        state.targets.includes(`${ORDER_ITEM}-${itemId}`)
      );
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
            selected={!isExpand && selected}
            selectable
          >
            <ItemCard>Total: {getByPathWithDefault(0, 'orderItemCount', data)} </ItemCard>
          </BaseCard>
        </div>
      );
      break;
    }
    case 'batchSummary': {
      const total = getByPathWithDefault(0, 'batchCount', data);
      if (total) {
        const batchIds = flatten(
          getByPathWithDefault([], 'data.orderItems', cell).map(item =>
            getByPathWithDefault([], 'batches', item).map(batch =>
              getByPathWithDefault('', 'id', batch)
            )
          )
        );
        const isTargetedAnyBatches = batchIds.some(batchId =>
          state.targets.includes(`${BATCH}-${batchId}`)
        );
        content = (
          <div className={ContentStyle} onClick={onClick} role="presentation">
            <BaseCard
              icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
              color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
              style={
                isExpand
                  ? {
                      background: '#DDDDDD',
                    }
                  : {}
              }
              selected={!isExpand && isTargetedAnyBatches}
              selectable
            >
              <BatchCard>Total: {getByPathWithDefault(0, 'batchCount', data)}</BatchCard>
            </BaseCard>
          </div>
        );
      } else {
        content = (
          <div
            style={{
              width: BATCH_WIDTH - 20,
            }}
            className={ContentStyle}
          />
        );
      }
      break;
    }
    case 'containerSummary': {
      const total = getByPathWithDefault(0, 'containerCount', data);
      const shipmentCount = getByPathWithDefault(0, 'shipmentCount', data);
      if (total) {
        const containerIds = flatten(
          getByPathWithDefault([], 'data.orderItems', cell).map(item =>
            getByPathWithDefault([], 'batches', item).map(batch =>
              getByPathWithDefault('', 'container.id', batch)
            )
          )
        ).filter(Boolean);

        const isTargetedAnyContainers = containerIds.some(containerId =>
          state.targets.includes(`${CONTAINER}-${containerId}`)
        );
        content = (
          <div className={ContentStyle} onClick={onClick} role="presentation">
            <BaseCard
              icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
              color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
              style={
                isExpand
                  ? {
                      background: '#DDDDDD',
                    }
                  : {}
              }
              selected={!isExpand && isTargetedAnyContainers}
              selectable
            >
              <ContainerCard>
                Total: {getByPathWithDefault(0, 'containerCount', data)}
              </ContainerCard>
            </BaseCard>
          </div>
        );
      } else if (shipmentCount) {
        const shipmentIds = flatten(
          getByPathWithDefault([], 'data.orderItems', cell).map(item =>
            getByPathWithDefault([], 'batches', item).map(batch =>
              getByPathWithDefault('', 'shipment.id', batch)
            )
          )
        ).filter(Boolean);
        const batchIds = flatten(
          getByPathWithDefault([], 'data.orderItems', cell).map(item =>
            getByPathWithDefault([], 'batches', item).map(batch =>
              getByPathWithDefault('', 'id', batch)
            )
          )
        ).filter(Boolean);

        const isTargetedAnyShipments = shipmentIds.some(shipmentId =>
          state.targets.includes(`${SHIPMENT}-${shipmentId}`)
        );
        const isTargetedAnyBatches = batchIds.some(batchId =>
          state.targets.includes(`${BATCH}-${batchId}`)
        );
        content = (
          <div style={{ width: CONTAINER_WIDTH - 20 }} className={ContentStyle}>
            <RelationLine
              isTargeted={isTargetedAnyShipments && isTargetedAnyBatches}
              hasRelation={isTargetedAnyShipments && isTargetedAnyBatches}
              type="HORIZONTAL"
            />
          </div>
        );
      } else {
        content = <div style={{ width: CONTAINER_WIDTH - 20 }} className={ContentStyle} />;
      }
      break;
    }
    case 'shipmentSummary': {
      const total = getByPathWithDefault(0, 'shipmentCount', data);
      if (total) {
        const shipmentIds = flatten(
          getByPathWithDefault([], 'data.orderItems', cell).map(item =>
            getByPathWithDefault([], 'batches', item).map(batch =>
              getByPathWithDefault('', 'shipment.id', batch)
            )
          )
        ).filter(Boolean);

        const isTargetedAnyShipments = shipmentIds.some(shipmentId =>
          state.targets.includes(`${SHIPMENT}-${shipmentId}`)
        );
        content = (
          <div className={ContentStyle} onClick={onClick} role="presentation">
            <BaseCard
              icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
              color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
              style={
                isExpand
                  ? {
                      background: '#DDDDDD',
                    }
                  : {}
              }
              selected={!isExpand && isTargetedAnyShipments}
              selectable
            >
              <ShipmentCard>Total {getByPathWithDefault(0, 'shipmentCount', data)}</ShipmentCard>
            </BaseCard>
          </div>
        );
      } else {
        content = <div style={{ width: SHIPMENT_WIDTH - 20 }} className={ContentStyle} />;
      }

      break;
    }
    case 'duplicateOrder':
      content = (
        <div
          style={{
            width: ORDER_WIDTH - 20,
          }}
          className={ContentStyle}
        />
      );
      break;
    case 'duplicateOrderItem': {
      content = (
        <div
          style={{
            width: ORDER_ITEM_WIDTH - 20,
          }}
          className={ContentStyle}
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
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            {...findLineColors({
              position: 'before',
              isExpand,
              type,
              state,
              cell,
              order,
            })}
            type={beforeConnector}
          />
        )}
      </div>
      {content}
      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            {...findLineColors({
              position: 'after',
              isExpand,
              type,
              state,
              cell,
              order,
            })}
            type={afterConnector}
          />
        )}
      </div>
    </div>
  );
};

export default cellRenderer;
