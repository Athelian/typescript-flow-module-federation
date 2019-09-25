// @flow
import React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Hits, Entities } from 'modules/relationMapV2/store';
import { ORDER, BATCH, SHIPMENT, TAG, PRODUCT } from 'modules/relationMapV2/constants';
import {
  EntitiesWrapperStyle,
  EntityWrapperStyle,
  EntityIconStyle,
  EntityCountStyle,
} from './style';

const MatchesEntities = () => {
  const { matches } = Hits.useContainer();
  const { mapping } = Entities.useContainer();
  const keys = Object.keys(matches.entity || {});
  const matchedOrder = keys.filter(key => key.includes(`-${ORDER}`)).length;
  const matchedOrderTags = Object.keys(mapping.entities?.orders ?? {}).filter(orderId =>
    keys.some(key =>
      (mapping.entities?.orders[orderId]?.tags ?? []).some(tag => key.includes(`${tag?.id}-${TAG}`))
    )
  ).length;
  const matchedOrderItem = Object.keys(mapping.entities?.orderItems ?? {}).filter(itemId =>
    keys.some(key =>
      key.includes(
        `${mapping.entities?.orderItems?.[itemId]?.productProvider?.product?.id}-${PRODUCT}`
      )
    )
  ).length;
  const matchedBatch = keys.filter(
    key => key.includes(`-${BATCH}`) && mapping.entities?.batches?.[matches.entity?.[key]?.id]
  ).length;
  const matchedShipment = keys.filter(key => key.includes(`-${SHIPMENT}`)).length;
  const matchedContainer = 0; // TODO: API is not supported yet

  return (
    <div className={EntitiesWrapperStyle}>
      <div className={EntityWrapperStyle(matchedOrder + matchedOrderTags)}>
        <div className={EntityIconStyle}>
          <Icon icon="ORDER" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedOrder + matchedOrderTags} />
        </div>
      </div>

      <div className={EntityWrapperStyle(matchedOrderItem)}>
        <div className={EntityIconStyle}>
          <Icon icon="ORDER_ITEM" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedOrderItem} />
        </div>
      </div>

      <div className={EntityWrapperStyle(matchedBatch)}>
        <div className={EntityIconStyle}>
          <Icon icon="BATCH" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedBatch} />
        </div>
      </div>

      <div className={EntityWrapperStyle(matchedContainer)}>
        <div className={EntityIconStyle}>
          <Icon icon="CONTAINER" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedContainer} />
        </div>
      </div>

      <div className={EntityWrapperStyle(matchedShipment)}>
        <div className={EntityIconStyle}>
          <Icon icon="SHIPMENT" />
        </div>
        <div className={EntityCountStyle}>
          <FormattedNumber value={matchedShipment} />
        </div>
      </div>
    </div>
  );
};

export default MatchesEntities;
