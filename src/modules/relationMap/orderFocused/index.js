// @flow
import React from 'react';
import { BooleanValue, createObjectValue } from 'react-values';
import update from 'immutability-helper';
import { getByPathWithDefault } from 'utils/fp';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from 'modules/relationMap/style';
import { CardAction } from 'components/Cards/BaseCard';

import RelationView from '../common/RelationView';
import DetailFocused, { ToggleSlide } from '../common/SlideForm';
import Item from '../common/RelationItem';
import generateRelation from './relation';

export const FocusedValue = createObjectValue({ focusedItem: {}, focusMode: '' });

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
      itemData = { id: relation.id };
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

const getFocusedLink = (focusedItem, relatedIds) =>
  Object.keys(focusedItem || {}).some(focusId =>
    relatedIds.some(relatedId => relatedId === focusId)
  );

const getHighlight = ({ focusedItem, focusMode, relation, itemType, isLink }) => {
  if (isLink && focusMode === 'HIGHLIGHT') {
    return getFocusedLink(focusedItem[relation.itemType], relation.relatedIds);
  }
  return getByPathWithDefault(false, `${itemType}.${relation.id}` || '', focusedItem);
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
              const isLink = /LINK-[0-4]-(\w+)/.test(relation.type);
              return (
                <ToggleSlide key={key}>
                  {({ assign: setSlide }) => (
                    <FocusedValue key={key}>
                      {({ value: { focusedItem, focusMode }, assign: setItem, reset }) => (
                        <Item
                          key={key}
                          type={relation.type}
                          isFocused={getHighlight({
                            isLink,
                            focusedItem,
                            focusMode,
                            itemType,
                            relation,
                          })}
                          {...focusMode && { focusMode }}
                          {...isLink && {
                            hasRelation: getByPathWithDefault(
                              false,
                              `${relation.itemType}.${relation.id}`,
                              focusedItem
                            ),
                          }}
                          actions={[
                            <CardAction
                              icon="SQUARE"
                              onClick={() => {
                                setItem({
                                  focusedItem: getByPathWithDefault({}, 'relation', itemData),
                                  focusMode: 'HIGHLIGHT',
                                });
                              }}
                            />,
                            <CardAction
                              icon="BRANCH"
                              onClick={() => {
                                const data = getByPathWithDefault({}, 'data', itemData);
                                setItem({
                                  focusedItem: update(
                                    focusMode === 'TARGET'
                                      ? focusedItem
                                      : {
                                          order: {},
                                          orderItem: {},
                                          batch: {},
                                          shipment: {},
                                        },
                                    {
                                      [itemType]: { $merge: { [data.id]: data } },
                                    }
                                  ),
                                  focusMode: 'TARGET',
                                });
                              }}
                            />,
                            <CardAction icon="CLEAR" onClick={reset} />,
                          ]}
                          onClick={toggle}
                          onDoubleClick={() => {
                            setSlide({
                              show: true,
                              type: relation.type,
                              id: relation.id,
                            });
                          }}
                          data={itemData.data || {}}
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
                    {({ value: { focusedItem }, assign, reset }) => (
                      <Item
                        key={shipmentId}
                        type={isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT'}
                        data={currentShipment.data}
                        isFocused={getByPathWithDefault(
                          false,
                          `shipment.${shipmentId}`,
                          focusedItem
                        )}
                        isCollapsed={isCollapsed}
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
                          <CardAction icon="CLEAR" onClick={reset} />,
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
