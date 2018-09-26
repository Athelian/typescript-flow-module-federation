// @flow
import React from 'react';
import { ObjectValue, BooleanValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import { generateShipmentRelation } from 'modules/relationMap/util';
import { ScrollWrapperStyle, ShipmentMapWrapperStyle } from 'modules/relationMap/style';
import RelationView from '../RelationView';
import Item from '../OrderElement';

type Props = {
  order: Object,
  shipment: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
};

const ShipmentFocused = ({ order, shipment, nodes, hasMore, loadMore }: Props) => (
  <ObjectValue defaultValue={{ selectedItem: '', focusedItem: null }}>
    {({ value: { focusedItem }, set: setItem }) => (
      <React.Fragment>
        <div className={ScrollWrapperStyle}>
          {Object.keys(order).map(orderId => {
            const currentOrder = order[orderId];
            const orderRefs = Object.keys(currentOrder.refs);
            return (
              <Item
                key={orderId}
                type="ORDER"
                data={shipment.orderObj[orderId]}
                isFocused={Object.keys(focusedItem || {}).some(focusId =>
                  orderRefs.some(shipmentId => shipmentId === focusId)
                )}
                onMouseEnter={() => setItem('focusedItem', currentOrder.refs)}
                onMouseLeave={() => setItem('focusedItem', null)}
              />
            );
          })}
        </div>
        <RelationView
          className={ShipmentMapWrapperStyle}
          items={nodes}
          itemWidth={200}
          isEmpty={nodes.length === 0}
          spacing={0}
          emptyMessage="No shipments found"
          hasMore={hasMore}
          onLoadMore={loadMore}
          render={({ item }) => (
            <BooleanValue defaultValue key={item.id}>
              {({ value: isCollapsed, toggle }) => {
                const relations = generateShipmentRelation(item, { isCollapsed });
                return relations.map((relation, relationIndex) => {
                  const key = `relation-${relationIndex}`;
                  let itemData;
                  switch (relation.type) {
                    case 'ORDER_HEADER':
                      itemData = { id: item.id };
                      break;
                    case 'ORDER':
                      itemData = shipment.orderObj[relation.id];
                      break;
                    case 'ORDER_ITEM':
                      itemData = shipment.orderItemObj[relation.id];
                      break;
                    case 'BATCH':
                      itemData = shipment.batchObj[relation.id];
                      break;
                    case 'ORDER_ITEM_ALL':
                    case 'BATCH_ALL':
                      itemData = shipment.shipmentObj[relation.id];
                      break;
                    case 'SHIPMENT':
                      itemData = shipment.shipmentObj[relation.id].data;
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
                      onMouseEnter={() =>
                        setItem('focusedItem', {
                          [item.id]: true,
                        })
                      }
                      onMouseLeave={() => setItem('focusedItem', null)}
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
      </React.Fragment>
    )}
  </ObjectValue>
);

export default ShipmentFocused;
