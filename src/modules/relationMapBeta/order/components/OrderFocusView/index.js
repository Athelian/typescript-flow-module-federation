// @flow
import * as React from 'react';
import type { OrderProps } from 'modules/relationMapBeta/order/type.js.flow';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { actionCreators } from 'modules/relationMapBeta/order/store';
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

export default function OrderFocusView({ item, highLightEntities }: Props) {
  const context = React.useContext(ActionDispatch);
  const { dispatch, state } = context;
  const actions = actionCreators(dispatch);
  const { highlight } = state;
  const isTarget = false;

  if (item.orderItems.length === 0)
    return (
      <>
        <Order
          wrapperClassName={ItemWrapperStyle(
            highLightEntities.includes(`${ORDER}-${item.id}`),
            isTarget,
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
          isTarget,
          highlight.type === ORDER && highlight.selectedId === item.id
        )}
        {...item}
      />
      <RelationLine type={1} />
      <TotalItems
        wrapperClassName={ItemWrapperStyle(
          !state.expandCards.orders.includes(item.id) &&
            ((highlight.type === ORDER && highlight.selectedId === item.id) ||
              item.orderItems
                .map(({ id }) => id)
                .some(id => highLightEntities.includes(`${ORDER_ITEM}-${id}`)))
        )}
        type="ITEMS"
        total={item.orderItemCount}
        onToggle={() => actions.toggleExpand(ORDER, item.id)}
      />
      <RelationLine type={1} />
      <TotalItems
        wrapperClassName={ItemWrapperStyle(
          !state.expandCards.orders.includes(item.id) &&
            ((highlight.type === ORDER && highlight.selectedId === item.id) ||
              item.orderItems
                .reduce(
                  (result, orderItem) => result.concat(orderItem.batches.map(({ id }) => id)),
                  []
                )
                .some(id => highLightEntities.includes(`${BATCH}-${id}`)))
        )}
        type="BATCHES"
        total={item.batchCount}
        onToggle={() => actions.toggleExpand(ORDER, item.id)}
      />
      {state.expandCards.orders.includes(item.id) &&
        item.orderItems.map(orderItem => (
          <React.Fragment key={orderItem.id}>
            {/* Render order item and first batch if available */}
            <div />
            <RelationLine type={4} />
            <OrderItem
              wrapperClassName={ItemWrapperStyle(
                highLightEntities.includes(`${ORDER_ITEM}-${orderItem.id}`),
                isTarget,
                highlight.type === ORDER_ITEM && highlight.selectedId === orderItem.id
              )}
              {...orderItem}
            />
            {orderItem.batches.length > 0 ? (
              <>
                <RelationLine type={1} />
                <Batch
                  wrapperClassName={ItemWrapperStyle(
                    highLightEntities.includes(`${BATCH}-${orderItem.batches[0].id}`),
                    isTarget,
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
                      <RelationLine type={2} />
                      <div />
                      <RelationLine type={4} />
                      <Batch
                        wrapperClassName={ItemWrapperStyle(
                          highLightEntities.includes(`${BATCH}-${batch.id}`),
                          isTarget,
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
