// @flow
import React from 'react';
import { EntityIcon } from 'components/NavBar';
import { Hits, Entities } from 'modules/relationMapV2/store';
import { ORDER, BATCH, SHIPMENT, TAG, PRODUCT } from 'modules/relationMapV2/constants';

type Props = {|
  isEnable: boolean,
  onChange: mixed => void,
  filter: Object,
|};

const filterMapping = {
  '0': {},
  '1': {
    shipmentArchived: true,
  },
};

const MatchesEntity = () => {
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
  const matchedBatch = keys.filter(key => key.includes(`-${BATCH}`)).length;
  const matchedShipment = keys.filter(key => key.includes(`-${SHIPMENT}`)).length;
  const matchedContainer = 0; // TODO: API is not supported yet
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <EntityIcon icon="ORDER" color={matchedOrder || matchedOrderTags ? 'BLUE' : 'GRAY'} />
      {matchedOrder + matchedOrderTags}
      <EntityIcon icon="ORDER_ITEM" color={matchedOrderItem ? 'BLUE' : 'GRAY'} />
      {matchedOrderItem}
      <EntityIcon icon="BATCH" color={matchedBatch ? 'BLUE' : 'GRAY'} />
      {matchedBatch}
      <EntityIcon icon="CONTAINER" color={matchedContainer ? 'BLUE' : 'GRAY'} />
      {matchedContainer}
      <EntityIcon icon="SHIPMENT" color={matchedShipment ? 'BLUE' : 'GRAY'} />
      {matchedShipment}
    </div>
  );
};

export default function CustomFiler({ isEnable, onChange, filter }: Props) {
  const isNotFiltered = Object.keys(filter).length === 1 && filter.query === '';
  if (!isEnable) {
    if (isNotFiltered) return null;

    return <MatchesEntity />;
  }

  return (
    <>
      <div>
        <select onChange={evt => onChange(filterMapping[evt.target.value])}>
          <option value={0}>N/A</option>
          <option value={1}>Shipment Archived</option>
        </select>
      </div>
      {!isNotFiltered && <MatchesEntity />}
    </>
  );
}
