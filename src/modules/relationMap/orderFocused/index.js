// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import {
  OrderFocusedShipmentScrollWrapperStyle,
  OrderMapWrapperStyle,
} from 'modules/relationMap/style';
import { ActionContainer } from 'modules/relationMap/containers';
import { isEmpty } from 'lodash';
import RelationView from '../common/RelationView';
import SlideForm from '../common/SlideForm';
import DeleteDialog from '../common/Dialog/DeleteDialog';
import generateRelation, { getItemData, getItemType } from './relation';
import Item from './Item';

type Props = {
  order: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
};

const OrderFocused = ({
  order: { order, orderItem, batch, shipment },
  nodes,
  hasMore,
  loadMore,
}: Props) => (
  <>
    <RelationView
      className={OrderMapWrapperStyle}
      isEmpty={nodes ? nodes.length === 0 : true}
      spacing={70}
      emptyMessage={
        <FormattedMessage id="modules.Orders.noOrderFound" defaultMessage="No orders found" />
      }
      hasMore={hasMore}
      onLoadMore={loadMore}
      customRender={() =>
        nodes.map(item => {
          const isCollapsedValue = Object.prototype.hasOwnProperty.call(item, 'isCollapsed')
            ? item.isCollapsed
            : true;
          return (
            <BooleanValue defaultValue={isCollapsedValue} key={item.id}>
              {({ value: isCollapsed, toggle }) => {
                const relations = generateRelation(item, { isCollapsed });
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
          );
        })
      }
    />
    <Subscribe to={[ActionContainer]}>
      {({ state: { result } }) => (
        <div className={OrderFocusedShipmentScrollWrapperStyle}>
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
      )}
    </Subscribe>
    <SlideForm />
    <DeleteDialog />
  </>
);

export default OrderFocused;
