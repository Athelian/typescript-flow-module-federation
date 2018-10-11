// @flow
import React from 'react';
import { BooleanValue, createObjectValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import { generateOrderRelation } from 'modules/relationMap/util';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from 'modules/relationMap/style';
import { CardAction } from 'components/Cards/BaseCard';
import RelationView from '../common/RelationView';
import DetailFocused, { ToggleSlide } from '../common/SlideForm';
import Item from '../common/RelationItem';

export const FocusedValue = createObjectValue({ focusedItem: {}, relationItem: {} });

type Props = {
  order: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
};

const OrderFocused = ({
  order: { orderObj: order, orderItemObj: orderItem, batchObj: batch, shipmentObj: shipment },
  nodes,
  hasMore,
  loadMore,
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
            const relations = generateOrderRelation(item, { isCollapsed });
            return relations.map((relation, relationIndex) => {
              const key = `relation-${relationIndex}`;
              let itemData;
              let itemType;
              switch (relation.type) {
                case 'ORDER_ITEM_ALL':
                  itemType = 'order';
                  itemData = order[item.id];
                  break;
                case 'BATCH_ALL':
                  itemType = 'order';
                  itemData = order[item.id];
                  break;
                case 'ORDER':
                  itemType = 'order';
                  itemData = order[relation.id];
                  break;
                case 'ORDER_HEADER':
                  itemData = { id: item.id };
                  break;
                case 'ORDER_ITEM':
                  itemType = 'orderItem';
                  itemData = orderItem[relation.id];
                  break;
                case 'BATCH':
                  itemType = 'batch';
                  itemData = batch[relation.id];
                  break;
                default:
                  itemData = {};
                  break;
              }
              return (
                <ToggleSlide key={key}>
                  {({ assign: setSlide }) => (
                    <FocusedValue key={key}>
                      {({ value: { focusedItem, relationItem }, assign: setItem, reset }) => (
                        <Item
                          key={key}
                          type={relation.type}
                          isFocused={
                            relationItem.type === relation.type
                              ? relationItem.id === relation.id
                              : getByPathWithDefault(
                                  false,
                                  `${itemType}.${relation.id}` || '',
                                  focusedItem
                                )
                          }
                          actions={[
                            <CardAction
                              icon="SQUARE"
                              onClick={() => {
                                setItem({
                                  focusedItem: getByPathWithDefault({}, 'relation', itemData),
                                  relationItem: relation,
                                });
                              }}
                            />,
                            <CardAction icon="BRANCH" onClick={() => {}} />,
                            <CardAction icon="CLEAR" onClick={reset} />,
                            <CardAction icon="REMOVE" onClick={() => {}} />,
                          ]}
                          onClick={toggle}
                          onDoubleClick={() => {
                            setSlide({
                              show: true,
                              type: relation.type,
                              id: relation.id,
                            });
                          }}
                          data={itemData}
                          isCollapsed={isCollapsed}
                        />
                      )}
                    </FocusedValue>
                  )}
                </ToggleSlide>
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
          <ToggleSlide key={shipmentId}>
            {({ assign: setSlide }) => (
              <BooleanValue defaultValue>
                {({ value: isCollapsed, toggle }) => (
                  <FocusedValue key={shipmentId}>
                    {({ value: { focusedItem, relationItem }, assign, reset }) => (
                      <Item
                        key={shipmentId}
                        type={isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT'}
                        data={currentShipment.data}
                        isFocused={
                          relationItem.type === 'SHIPMENT'
                            ? relationItem.id === shipmentId
                            : getByPathWithDefault(false, `shipment.${shipmentId}`, focusedItem)
                        }
                        isCollapsed={isCollapsed}
                        onMouseLeave={reset}
                        onMouseEnter={() =>
                          assign({ focusedItem: currentShipment.refs, shipmentId })
                        }
                        actions={[
                          <CardAction
                            icon="SQUARE"
                            onClick={() => {
                              assign({
                                focusedItem: currentShipment.relation,
                                relationItem: {
                                  id: shipmentId,
                                  type: 'SHIPMENT',
                                },
                              });
                            }}
                          />,
                          <CardAction icon="BRANCH" onClick={() => {}} />,
                          <CardAction icon="CLEAR" onClick={reset} />,
                          <CardAction icon="REMOVE" onClick={() => {}} />,
                        ]}
                        onClick={toggle}
                        onDoubleClick={() => {
                          setSlide({
                            show: true,
                            type: 'SHIPMENT',
                            id: shipmentId,
                          });
                        }}
                      />
                    )}
                  </FocusedValue>
                )}
              </BooleanValue>
            )}
          </ToggleSlide>
        );
      })}
    </div>
    <DetailFocused />
  </>
);

export default OrderFocused;
