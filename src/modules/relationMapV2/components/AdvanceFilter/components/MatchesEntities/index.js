// @flow
import React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Hits, Entities, OrderFocused } from 'modules/relationMapV2/store';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT, TAG, PRODUCT } from 'modules/relationMapV2/constants';
import {
  EntitiesWrapperStyle,
  EntityWrapperStyle,
  EntityIconStyle,
  EntityCountStyle,
  SelectedEntitiesWrapperStyle,
} from './style';

const MatchesEntities = () => {
  const { dispatch } = OrderFocused.useContainer();
  const { matches } = Hits.useContainer();
  const { mapping } = Entities.useContainer();
  const keys = Object.keys(matches.entity || {});
  const matchedOrderIds = keys.filter(key => key.includes(`-${ORDER}`));
  const matchedOrderTagIds = Object.keys(mapping.entities?.orders ?? {}).filter(orderId =>
    keys.some(key =>
      (mapping.entities?.orders[orderId]?.tags ?? []).some(tag => key.includes(`${tag?.id}-${TAG}`))
    )
  );
  const orderIds = [
    ...new Set(
      [...matchedOrderIds, ...matchedOrderTagIds].map(id => {
        const [orderId] = id.split('-') || [];
        return orderId;
      })
    ),
  ];
  const orderMatched = orderIds.length;
  const matchedOrderItemIds = Object.keys(mapping.entities?.orderItems ?? {}).filter(itemId =>
    keys.some(key =>
      key.includes(
        `${mapping.entities?.orderItems?.[itemId]?.productProvider?.product?.id}-${PRODUCT}`
      )
    )
  );
  const orderItemIds = [
    ...new Set(
      matchedOrderItemIds.map(id => {
        const [itemId] = id.split('-') || [];
        return itemId;
      })
    ),
  ];
  const matchedOrderItem = orderItemIds.length;
  const matchedBatchIds = keys.filter(
    key => key.includes(`-${BATCH}`) && mapping.entities?.batches?.[matches.entity?.[key]?.id]
  );
  const batchIds = [
    ...new Set(
      matchedBatchIds.map(id => {
        const [batchId] = id.split('-') || [];
        return batchId;
      })
    ),
  ];
  const matchedBatch = batchIds.length;
  const matchedShipmentIds = keys.filter(key => key.includes(`-${SHIPMENT}`));
  const shipmentIds = [
    ...new Set(
      matchedShipmentIds.map(id => {
        const [batchId] = id.split('-') || [];
        return batchId;
      })
    ),
  ];
  const matchedShipment = shipmentIds.length;
  const matchedContainer = 0; // TODO: API is not supported yet

  return (
    <div className={EntitiesWrapperStyle}>
      <div className={EntityWrapperStyle(orderMatched)}>
        <div className={EntityIconStyle}>
          <Icon icon="ORDER" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={orderMatched} />
        </div>
        <button
          className={SelectedEntitiesWrapperStyle}
          onClick={() => {
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets: orderIds.map(id => `${ORDER}-${id}`),
              },
            });
          }}
          type="button"
        >
          <Icon icon="CHECKED" />
        </button>
      </div>

      <div className={EntityWrapperStyle(matchedOrderItem)}>
        <div className={EntityIconStyle}>
          <Icon icon="ORDER_ITEM" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedOrderItem} />
        </div>
        <button
          className={SelectedEntitiesWrapperStyle}
          onClick={() => {
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets: orderItemIds.map(id => `${ORDER_ITEM}-${id}`),
              },
            });
          }}
          type="button"
        >
          <Icon icon="CHECKED" />
        </button>
      </div>

      <div className={EntityWrapperStyle(matchedBatch)}>
        <div className={EntityIconStyle}>
          <Icon icon="BATCH" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedBatch} />
        </div>
        <button
          className={SelectedEntitiesWrapperStyle}
          onClick={() => {
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets: batchIds.map(id => `${BATCH}-${id}`),
              },
            });
          }}
          type="button"
        >
          <Icon icon="CHECKED" />
        </button>
      </div>

      <div className={EntityWrapperStyle(matchedContainer)}>
        <div className={EntityIconStyle}>
          <Icon icon="CONTAINER" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedContainer} />
        </div>
        <button
          className={SelectedEntitiesWrapperStyle}
          onClick={() => {
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                // TODO: API is not ready yet
                targets: [],
              },
            });
          }}
          type="button"
        >
          <Icon icon="CHECKED" />
        </button>
      </div>

      <div className={EntityWrapperStyle(matchedShipment)}>
        <div className={EntityIconStyle}>
          <Icon icon="SHIPMENT" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedShipment} />
        </div>
        <button
          className={SelectedEntitiesWrapperStyle}
          onClick={() => {
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets: shipmentIds.map(id => `${SHIPMENT}-${id}`),
              },
            });
          }}
          type="button"
        >
          <Icon icon="CHECKED" />
        </button>
      </div>
    </div>
  );
};

export default MatchesEntities;
