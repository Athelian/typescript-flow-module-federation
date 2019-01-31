// @flow
import * as React from 'react';
import { findLastIndex } from 'lodash';
import logger from 'utils/logger';
import type { OrderProps } from 'modules/relationMapBeta/order/type.js.flow';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { actionCreators, selectors } from 'modules/relationMapBeta/order/store';
import { ItemWrapperStyle } from 'modules/relationMap/common/RelationItem/style';
import { RelationLine } from 'components/RelationMap';
import { ORDER, ORDER_ITEM, BATCH } from 'modules/relationMap/constants';
import Order from './Order';
import OrderItem from './OrderItem';
import Batch from './Batch';
import TotalItems from './TotalItems';

type Props = {
  item: OrderProps,
  highLightEntities: Array<string>,
};

function findRelateBatches({
  state,
  batchId,
  processBatchIds,
  batches,
  orderingBatches,
}: {
  state: Object,
  batchId: string,
  processBatchIds: Array<string>,
  batches: Array<Object>,
  orderingBatches: Array<Object>,
}) {
  if (state.split.batches[batchId]) {
    (Object.entries(state.split.batches[batchId]): Array<any>)
      .reverse()
      .forEach(([, currentBatch]) => {
        processBatchIds.push(currentBatch.id);
        const selectedBatch = batches.find(item => Number(item.id) === Number(currentBatch.id));
        if (selectedBatch) {
          orderingBatches.push(selectedBatch);
          findRelateBatches({
            batchId: currentBatch.id,
            state,
            processBatchIds,
            batches,
            orderingBatches,
          });
        }
      });
  }
  if (state.clone.batches[batchId]) {
    (Object.entries(state.clone.batches[batchId]): Array<any>)
      .reverse()
      .forEach(([, currentBatch]) => {
        processBatchIds.push(currentBatch.id);
        const selectedBatch = batches.find(item => Number(item.id) === Number(currentBatch.id));
        if (selectedBatch) {
          orderingBatches.push(selectedBatch);
          findRelateBatches({
            batchId: currentBatch.id,
            state,
            processBatchIds,
            batches,
            orderingBatches,
          });
        }
      });
  }
}

function manualSortByAction(orderItems: Array<Object>, state: Object) {
  logger.warn({
    orderItems,
    state,
  });
  return orderItems.map(orderItem => {
    const { batches } = orderItem;
    const orderingBatches = [];
    const processBatchIds = [];
    batches.forEach(batch => {
      if (!processBatchIds.includes(batch.id)) {
        orderingBatches.push(batch);
        processBatchIds.push(batch.id);
        const batchId = batch.id;
        findRelateBatches({ state, batchId, processBatchIds, batches, orderingBatches });
      }
    });

    return {
      ...orderItem,
      batches: orderingBatches,
    };
  });
}

export default function OrderFocusView({ item, highLightEntities }: Props) {
  const context = React.useContext(ActionDispatch);
  const { dispatch, state } = context;
  const actions = actionCreators(dispatch);
  const { highlight } = state;
  const uiSelectors = selectors(state);

  if (item.orderItems.length === 0)
    return (
      <>
        <Order
          wrapperClassName={ItemWrapperStyle(
            highLightEntities.includes(`${ORDER}-${item.id}`),
            uiSelectors.isTarget(ORDER, item.id),
            highlight.type === ORDER && highlight.selectedId === item.id
          )}
          {...item}
        />
        <div />
        <div />
        <div />
        <div />
      </>
    );
  return (
    <>
      <Order
        wrapperClassName={ItemWrapperStyle(
          highLightEntities.includes(`${ORDER}-${item.id}`),
          uiSelectors.isTarget(ORDER, item.id),
          highlight.type === ORDER && highlight.selectedId === item.id
        )}
        {...item}
      />
      <RelationLine
        type={1}
        isTargeted={
          uiSelectors.isTarget(ORDER, item.id) &&
          item.orderItems.map(({ id }) => id).some(id => uiSelectors.isTarget(ORDER_ITEM, id))
        }
        hasRelation={
          (!state.expandCards.orders.includes(item.id) &&
            item.orderItems.map(({ id }) => id).some(id => uiSelectors.isTarget(ORDER_ITEM, id))) ||
          (!state.expandCards.orders.includes(item.id) &&
            ((highlight.type === ORDER && highlight.selectedId === item.id) ||
              item.orderItems
                .map(({ id }) => id)
                .some(id => highLightEntities.includes(`${ORDER_ITEM}-${id}`))))
        }
        isFocused={
          (highlight.type === ORDER && highlight.selectedId === item.id) ||
          item.orderItems
            .map(({ id }) => id)
            .some(id => highLightEntities.includes(`${ORDER_ITEM}-${id}`))
        }
      />
      <TotalItems
        wrapperClassName={ItemWrapperStyle(
          !state.expandCards.orders.includes(item.id) &&
            ((highlight.type === ORDER && highlight.selectedId === item.id) ||
              item.orderItems
                .map(({ id }) => id)
                .some(id => highLightEntities.includes(`${ORDER_ITEM}-${id}`))),
          !state.expandCards.orders.includes(item.id) &&
            item.orderItems.map(({ id }) => id).some(id => uiSelectors.isTarget(ORDER_ITEM, id))
        )}
        type="ITEMS"
        total={item.orderItemCount}
        onToggle={() => actions.toggleExpand(ORDER, item.id)}
      />
      <RelationLine
        type={1}
        isTargeted={
          !state.expandCards.orders.includes(item.id) &&
          item.orderItems.map(({ id }) => id).some(id => uiSelectors.isTarget(ORDER_ITEM, id)) &&
          item.orderItems
            .reduce((result, orderItem) => result.concat(orderItem.batches.map(({ id }) => id)), [])
            .some(id => uiSelectors.isTarget(BATCH, id))
        }
        isFocused={
          !state.expandCards.orders.includes(item.id) &&
          ((highlight.type === ORDER && highlight.selectedId === item.id) ||
            item.orderItems
              .reduce(
                (result, orderItem) => result.concat(orderItem.batches.map(({ id }) => id)),
                []
              )
              .some(id => highLightEntities.includes(`${BATCH}-${id}`)))
        }
        hasRelation
      />
      <TotalItems
        wrapperClassName={ItemWrapperStyle(
          !state.expandCards.orders.includes(item.id) &&
            ((highlight.type === ORDER && highlight.selectedId === item.id) ||
              item.orderItems
                .reduce(
                  (result, orderItem) => result.concat(orderItem.batches.map(({ id }) => id)),
                  []
                )
                .some(id => highLightEntities.includes(`${BATCH}-${id}`))),
          !state.expandCards.orders.includes(item.id) &&
            item.orderItems
              .reduce(
                (result, orderItem) => result.concat(orderItem.batches.map(({ id }) => id)),
                []
              )
              .some(id => uiSelectors.isTarget(BATCH, id))
        )}
        type="BATCHES"
        total={item.batchCount}
        onToggle={() => actions.toggleExpand(ORDER, item.id)}
      />
      {state.expandCards.orders.includes(item.id) &&
        manualSortByAction(item.orderItems, state).map((orderItem, position) => (
          <React.Fragment key={orderItem.id}>
            {/* Render order item and first batch if available */}
            <div />
            <RelationLine
              type={4}
              isTargeted={
                findLastIndex(item.orderItems, currentOrderItem =>
                  uiSelectors.isTarget(ORDER_ITEM, currentOrderItem.id)
                ) >= position && uiSelectors.isTarget(ORDER, item.id)
              }
              isFocused={
                uiSelectors.isSelectEntity(highLightEntities, ORDER, item.id) &&
                findLastIndex(item.orderItems, currentOrderItem =>
                  uiSelectors.isSelectEntity(highLightEntities, ORDER_ITEM, currentOrderItem.id)
                ) >= position
              }
              hasRelation={
                uiSelectors.isTarget(ORDER_ITEM, orderItem.id) ||
                uiSelectors.isSelectEntity(highLightEntities, ORDER_ITEM, orderItem.id)
              }
            />
            <OrderItem
              wrapperClassName={ItemWrapperStyle(
                highLightEntities.includes(`${ORDER_ITEM}-${orderItem.id}`),
                uiSelectors.isTarget(ORDER_ITEM, orderItem.id),
                highlight.type === ORDER_ITEM && highlight.selectedId === orderItem.id
              )}
              {...orderItem}
            />
            {orderItem.batches.length > 0 ? (
              <>
                <RelationLine
                  type={1}
                  isTargeted={
                    orderItem.batches.some(batchItem =>
                      uiSelectors.isTarget(BATCH, batchItem.id)
                    ) && uiSelectors.isTarget(ORDER_ITEM, orderItem.id)
                  }
                  isFocused={
                    orderItem.batches.some(batchItem =>
                      uiSelectors.isSelectEntity(highLightEntities, BATCH, batchItem.id)
                    ) && uiSelectors.isSelectEntity(highLightEntities, ORDER_ITEM, orderItem.id)
                  }
                  hasRelation={
                    (uiSelectors.isTarget(BATCH, orderItem.batches[0].id) &&
                      uiSelectors.isTarget(ORDER_ITEM, orderItem.id)) ||
                    uiSelectors.isSelectEntity(highLightEntities, BATCH, orderItem.batches[0].id)
                  }
                />
                <Batch
                  parentOrderId={item.id}
                  wrapperClassName={ItemWrapperStyle(
                    highLightEntities.includes(`${BATCH}-${orderItem.batches[0].id}`),
                    uiSelectors.isTarget(BATCH, orderItem.batches[0].id),
                    highlight.type === BATCH && highlight.selectedId === orderItem.batches[0].id
                  )}
                  {...orderItem.batches[0]}
                />
              </>
            ) : (
              <>
                <div /> <div />
              </>
            )}
            {/* render the the remaining batches, from 2nd to end */}
            {orderItem.batches.length > 1 &&
              orderItem.batches.map(
                (batch, index) =>
                  index > 0 && (
                    <React.Fragment key={batch.id}>
                      <div />
                      {item.orderItems.length > 1 && position < item.orderItems.length - 1 ? (
                        <RelationLine
                          type={2}
                          isTargeted={
                            uiSelectors.isTarget(ORDER, item.id) &&
                            findLastIndex(item.orderItems, currentOrderItem =>
                              uiSelectors.isTarget(ORDER_ITEM, currentOrderItem.id)
                            ) > position
                          }
                          isFocused={
                            (state.highlight.type === ORDER &&
                              state.highlight.selectedId === item.id) ||
                            (uiSelectors.isSelectEntity(highLightEntities, ORDER, item.id) &&
                              findLastIndex(item.orderItems, currentOrderItem =>
                                uiSelectors.isSelectEntity(
                                  highLightEntities,
                                  ORDER_ITEM,
                                  currentOrderItem.id
                                )
                              ) > position)
                          }
                          hasRelation={uiSelectors.isTarget(ORDER_ITEM, orderItem.id)}
                        />
                      ) : (
                        <div />
                      )}
                      <div />
                      <RelationLine
                        type={4}
                        isTargeted={
                          findLastIndex(orderItem.batches, batchItem =>
                            uiSelectors.isTarget(BATCH, batchItem.id)
                          ) >= index && uiSelectors.isTarget(ORDER_ITEM, orderItem.id)
                        }
                        isFocused={
                          findLastIndex(orderItem.batches, batchItem =>
                            uiSelectors.isSelectEntity(highLightEntities, BATCH, batchItem.id)
                          ) >= index &&
                          uiSelectors.isSelectEntity(highLightEntities, ORDER_ITEM, orderItem.id)
                        }
                        hasRelation={
                          uiSelectors.isTarget(BATCH, batch.id) ||
                          uiSelectors.isSelectEntity(highLightEntities, BATCH, batch.id)
                        }
                      />
                      <Batch
                        parentOrderId={item.id}
                        wrapperClassName={ItemWrapperStyle(
                          highLightEntities.includes(`${BATCH}-${batch.id}`),
                          uiSelectors.isTarget(BATCH, batch.id),
                          highlight.type === BATCH && highlight.selectedId === batch.id
                        )}
                        {...batch}
                      />
                    </React.Fragment>
                  )
              )}
          </React.Fragment>
        ))}
    </>
  );
}
