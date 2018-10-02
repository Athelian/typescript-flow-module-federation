// @flow
import React from 'react';
import { BooleanValue, createObjectValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import { generateOrderRelation } from 'modules/relationMap/util';
import ShipmentHeader from 'modules/relationMap/components/ShipmentElement/ShipmentHeader';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from 'modules/relationMap/style';

import RelationView from '../RelationView';
import Item from '../OrderElement';

const FocusedValue = createObjectValue(null);
type Props = {
  order: Object,
  shipment: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
};

const OrderFocused = ({ order, shipment, nodes, hasMore, loadMore }: Props) => (
  // <ObjectValue defaultValue={{ selectedItem: '', focusedItem: null }}>
  //   {({ value: { focusedItem }, set: setItem }) => (
  <>
    <RelationView
      className={OrderMapWrapperStyle}
      items={nodes}
      itemWidth={200}
      isEmpty={nodes.length === 0}
      spacing={0}
      emptyMessage="No orders found"
      hasMore={hasMore}
      onLoadMore={loadMore}
      render={({ item }) => (
        <BooleanValue defaultValue key={item.id}>
          {({ value: isCollapsed, toggle }) => {
            const relations = generateOrderRelation(item, { isCollapsed });
            return relations.map((relation, relationIndex) => {
              const key = `relation-${relationIndex}`;
              let itemData;
              switch (relation.type) {
                case 'ORDER_ITEM_ALL':
                case 'BATCH_ALL':
                case 'ORDER':
                  itemData = order.orderObj[relation.id];
                  break;
                case 'ORDER_HEADER':
                  itemData = { id: item.id };
                  break;
                case 'ORDER_ITEM':
                  itemData = order.orderItemObj[relation.id];
                  break;
                case 'BATCH':
                  itemData = order.batchObj[relation.id];
                  break;
                default:
                  itemData = {};
                  break;
              }
              return (
                <FocusedValue key={key}>
                  {({ value: focusedItem, set: setItem, reset }) => (
                    <Item
                      key={key}
                      type={relation.type}
                      isFocused={getByPathWithDefault(false, item.id, focusedItem)}
                      onMouseLeave={reset}
                      onMouseEnter={() => setItem(item.id, true)}
                      onClick={() => {
                        toggle();
                      }}
                      data={itemData}
                      isCollapsed={isCollapsed}
                    />
                  )}
                </FocusedValue>
              );
            });
          }}
        </BooleanValue>
      )}
    />
    <div className={ScrollWrapperStyle}>
      {Object.keys(shipment).map(shipmentId => {
        const currentShipment = shipment[shipmentId];
        const shipmentRefs = Object.keys(currentShipment.refs);
        return (
          <FocusedValue key={shipmentId}>
            {({ value: focusedItem, assign, reset }) => (
              <div key={shipmentId}>
                <ShipmentHeader
                  label={`SHIPMENT ${currentShipment.data.id}`}
                  isChecked
                  ordersNo={currentShipment.numberOfOrder}
                  batchesNo={currentShipment.numberOfBatch}
                  onToggle={() => {}}
                />
                <Item
                  key={shipmentId}
                  type="SHIPMENT"
                  data={currentShipment.data}
                  isFocused={Boolean(
                    Object.keys(focusedItem || {}).some(focusId =>
                      shipmentRefs.some(orderId => orderId === focusId)
                    )
                  )}
                  onMouseLeave={reset}
                  onMouseEnter={() => assign(currentShipment.refs)}
                />
              </div>
            )}
          </FocusedValue>
        );
      })}
    </div>
  </>
  //   )}
  // </ObjectValue>
);

export default OrderFocused;
