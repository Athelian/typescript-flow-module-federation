// @flow
import React from 'react';
import { intersection } from 'lodash';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Hits, Entities, FocusedView } from 'modules/relationMapV2/store';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT, TAG, PRODUCT } from 'modules/relationMapV2/constants';
import { targetedIds } from 'modules/relationMapV2/helpers';
import {
  EntitiesWrapperStyle,
  EntityWrapperStyle,
  EntityIconStyle,
  EntityCountStyle,
  SelectedEntitiesWrapperStyle,
} from './style';

const MatchesEntities = () => {
  const { state, dispatch } = FocusedView.useContainer();
  const selectedOrderIds = targetedIds(state.targets, ORDER);
  const selectedOrderItemIds = targetedIds(state.targets, ORDER_ITEM);
  const selectedBatchIds = targetedIds(state.targets, BATCH);
  // const selectedContainerIds = targetedIds(state.targets, CONTAINER);
  const selectedShipmentIds = targetedIds(state.targets, SHIPMENT);
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
  const isUnselectOrders = intersection(selectedOrderIds, orderIds).length === orderMatched;
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
  const isUnselectOrderItems =
    intersection(selectedOrderItemIds, orderItemIds).length === matchedOrderItem;
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
  const isUnselectBatches = intersection(selectedBatchIds, batchIds).length === matchedBatch;
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
  const isUnselectShipments =
    intersection(selectedShipmentIds, shipmentIds).length === matchedShipment;
  // TODO: API is not supported yet
  const matchedContainer = 0;
  const isUnselectContainers = false;

  return (
    <div className={EntitiesWrapperStyle}>
      <div className={EntityWrapperStyle(orderMatched)}>
        <div className={EntityIconStyle}>
          <Icon icon="ORDER" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={orderMatched} />
        </div>
        {orderMatched > 0 && (
          <button
            className={SelectedEntitiesWrapperStyle(isUnselectOrders)}
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
            <Icon icon={isUnselectOrders ? 'CLEAR' : 'CONFIRM'} />
          </button>
        )}
      </div>

      <div className={EntityWrapperStyle(matchedOrderItem)}>
        <div className={EntityIconStyle}>
          <Icon icon="ORDER_ITEM" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedOrderItem} />
        </div>
        {matchedOrderItem > 0 && (
          <button
            className={SelectedEntitiesWrapperStyle(isUnselectOrderItems)}
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
            <Icon icon={isUnselectOrderItems ? 'CLEAR' : 'CONFIRM'} />
          </button>
        )}
      </div>

      <div className={EntityWrapperStyle(matchedBatch)}>
        <div className={EntityIconStyle}>
          <Icon icon="BATCH" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedBatch} />
        </div>
        {matchedBatch > 0 && (
          <button
            className={SelectedEntitiesWrapperStyle(isUnselectBatches)}
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
            <Icon icon={isUnselectBatches ? 'CLEAR' : 'CONFIRM'} />
          </button>
        )}
      </div>

      <div className={EntityWrapperStyle(matchedContainer)}>
        <div className={EntityIconStyle}>
          <Icon icon="CONTAINER" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedContainer} />
        </div>
        {matchedContainer > 0 && (
          <button
            className={SelectedEntitiesWrapperStyle(isUnselectContainers)}
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
            <Icon icon={isUnselectContainers ? 'CLEAR' : 'CONFIRM'} />
          </button>
        )}
      </div>

      <div className={EntityWrapperStyle(matchedShipment)}>
        <div className={EntityIconStyle}>
          <Icon icon="SHIPMENT" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedShipment} />
        </div>
        {matchedShipment > 0 && (
          <button
            className={SelectedEntitiesWrapperStyle(isUnselectShipments)}
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
            <Icon icon={isUnselectShipments ? 'CLEAR' : 'CONFIRM'} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchesEntities;
