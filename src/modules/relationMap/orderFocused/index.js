// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from 'modules/relationMap/style';
import { isEmpty } from 'lodash';
import RelationView from '../common/RelationView';
import DetailFocused from '../common/SlideForm';
import generateRelation, { getItemData, getItemType } from './relation';
import Item from './Item';

type Props = {
  order: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
  result: Object,
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
      isEmpty={nodes ? nodes.length === 0 : true}
      spacing={70}
      emptyMessage="No orders found"
      hasMore={hasMore}
      onLoadMore={loadMore}
      customRender={() =>
        nodes.map(item => (
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
        ))
      }
    />
    <div className={ScrollWrapperStyle}>
      {result.shipment &&
        result.shipment.map(newShipment => {
          if (isEmpty(newShipment)) {
            return null;
          }
          return (
            <BooleanValue defaultValue key={newShipment.id}>
              {({ value: isCollapsed, toggle }) => (
                <Item
                  key={newShipment.id}
                  onToggle={toggle}
                  isCollapsed={isCollapsed}
                  relation={{
                    type: isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT',
                    id: newShipment.id,
                  }}
                  itemData={{ data: newShipment }}
                  itemType="shipment"
                />
              )}
            </BooleanValue>
          );
        })}
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
