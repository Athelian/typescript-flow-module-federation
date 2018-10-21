// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from 'modules/relationMap/style';
import RelationView from '../common/RelationView';
import DetailFocused from '../common/SlideForm';
import generateRelation from './relation';
import Item from './Item';

type Props = {
  order: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
  result: Object,
};

const getItemData = ({ order, orderItem, batch }, relation) => {
  let itemData;
  switch (relation.type) {
    case 'ORDER_ITEM_ALL':
    case 'BATCH_ALL':
    case 'ORDER':
      itemData = order[relation.id];
      break;
    case 'ORDER_HEADER':
      itemData = { data: { id: relation.id } };
      break;
    case 'ORDER_ITEM':
      itemData = orderItem[relation.id];
      break;
    case 'BATCH':
      itemData = batch[relation.id];
      break;
    default:
      itemData = {};
      break;
  }
  return itemData;
};

const getItemType = type => {
  switch (type) {
    case 'ORDER_ITEM_ALL':
    case 'BATCH_ALL':
    case 'ORDER':
      return 'order';
    case 'ORDER_HEADER':
    case 'ORDER_ITEM':
      return 'orderItem';
    case 'BATCH':
      return 'batch';
    default:
      return '';
  }
};

const OrderFocused = ({
  order: { orderObj: order, orderItemObj: orderItem, batchObj: batch, shipmentObj: shipment },
  nodes,
  hasMore,
  loadMore,
  result,
}: Props) => (
  <>
    <RelationView
      className={OrderMapWrapperStyle}
      items={nodes}
      itemWidth={200}
      isEmpty={nodes.length === 0}
      spacing={70}
      emptyMessage="No orders found"
      hasMore={hasMore}
      onLoadMore={loadMore}
      render={({ item }) => (
        <BooleanValue defaultValue key={item.id}>
          {({ value: isCollapsed, toggle }) => {
            const relations = generateRelation(item, { isCollapsed, result });
            return relations.map((relation, relationIndex) => {
              const key = `relation-${relationIndex}`;
              const itemData = getItemData({ order, orderItem, batch }, relation);
              const itemType = getItemType(relation.type);
              return (
                <Item
                  key={key}
                  onToggle={toggle}
                  isCollapsed={isCollapsed}
                  relation={relation}
                  itemData={itemData}
                  itemType={itemType}
                />
              );
            });
          }}
        </BooleanValue>
      )}
    />
    <div className={ScrollWrapperStyle}>
      {Object.keys(shipment).map(shipmentId => {
        const currentShipment = shipment[shipmentId];
        return (
          <BooleanValue defaultValue key={shipmentId}>
            {({ value: isCollapsed, toggle }) => (
              <Item
                key={shipmentId}
                onToggle={toggle}
                isCollapsed={isCollapsed}
                relation={{
                  type: isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT',
                  id: shipmentId,
                }}
                itemData={currentShipment}
                itemType="shipment"
              />
            )}
          </BooleanValue>
        );
      })}
    </div>

    <DetailFocused />
  </>
);

export default OrderFocused;
