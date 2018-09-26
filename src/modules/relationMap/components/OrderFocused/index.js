// @flow
import React from 'react';
import { ObjectValue, BooleanValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import { generateOrderRelation } from 'modules/relationMap/util';
import RelationView from '../RelationView';
import Item from '../OrderElement';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from '../../style';

type Props = {
  order: Object,
  shipment: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
};

const OrderFocused = ({ order, shipment, nodes, hasMore, loadMore }: Props) => (
  <ObjectValue defaultValue={{ selectedItem: '', focusedItem: null }}>
    {({ value: { focusedItem }, set: setItem }) => (
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
                    <Item
                      key={key}
                      type={relation.type}
                      isFocused={getByPathWithDefault(false, item.id, focusedItem)}
                      onMouseLeave={() => setItem('focusedItem', null)}
                      onMouseEnter={() =>
                        setItem('focusedItem', {
                          [item.id]: true,
                        })
                      }
                      onClick={() => {
                        toggle();
                      }}
                      data={itemData}
                      isCollapsed={isCollapsed}
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
            const shipmentRefs = Object.keys(currentShipment.refs);
            return (
              <Item
                key={shipmentId}
                type="SHIPMENT"
                data={currentShipment.data}
                isFocused={Boolean(
                  Object.keys(focusedItem || {}).some(focusId =>
                    shipmentRefs.some(orderId => orderId === focusId)
                  )
                )}
                onMouseLeave={() => setItem('focusedItem', null)}
                onMouseEnter={() => setItem('focusedItem', currentShipment.refs)}
              />
            );
          })}
        </div>
      </>
    )}
  </ObjectValue>
);

export default OrderFocused;
