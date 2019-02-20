// @flow
import React from 'react';
import { createObjectValue, BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { Subscribe } from 'unstated';
import { shipmentListQuery } from 'modules/relationMap/orderFocused/query';
import { ActionContainer } from 'modules/relationMap/containers';
import SlideForm from '../common/SlideForm';
import DeleteDialog from '../common/Dialog/DeleteDialog';
import ShipmentList from '../common/ShipmentList';
import { QueryHandler, RelationView } from '../common';
import { getItemData, getItemType } from './relation';
import Item from './Item';
import {
  OrderListWrapperStyle,
  OrderListBodyStyle,
  ShipmentListWrapperStyle,
  ShipmentListBodyStyle,
} from './style';

type OptionalProps = {
  id: string,
};

type Props = OptionalProps & {
  order: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
  ShipmentToggleValue: any,
};

const defaultProps = {
  id: '',
};

export const ToggleCollapsed = createObjectValue({});

const OrderFocused = ({
  order: { order, orderItem, batch, shipment, collapsedRelation, expandRelation },
  nodes,
  hasMore,
  loadMore,
  id,
  ShipmentToggleValue,
}: Props) => (
  <>
    <div className={OrderListWrapperStyle}>
      <RelationView
        id={id}
        className={OrderListBodyStyle}
        isEmpty={nodes ? nodes.length === 0 : true}
        emptyMessage={
          <FormattedMessage id="modules.Orders.noOrderFound" defaultMessage="No orders found" />
        }
        hasMore={hasMore}
        onLoadMore={loadMore}
        customRender={() =>
          nodes.map(item => (
            <ToggleCollapsed key={item.id}>
              {({ value: collapsed, set }) => {
                const isCollapsed = Object.prototype.hasOwnProperty.call(collapsed, item.id)
                  ? collapsed[item.id]
                  : true;
                const toggle = () => set(item.id, !isCollapsed);
                const relations = isCollapsed
                  ? collapsedRelation[item.id]
                  : expandRelation[item.id];
                return relations.map((relation, relationIndex) => {
                  const key = `relation-${relationIndex}`;
                  const itemData = getItemData({ order, orderItem, batch }, relation) || {};
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
            </ToggleCollapsed>
          ))
        }
      />
    </div>
    <Subscribe to={[ActionContainer]}>
      {({ state: { result } }) => (
        <ShipmentToggleValue>
          {({ value: { isToggle: isToggleShipment, total }, set: setShipmentToggle }) => {
            if (isToggleShipment) {
              return (
                <Query
                  query={shipmentListQuery}
                  fetchPolicy="network-only"
                  variables={{
                    page: 1,
                    perPage: 10,
                  }}
                >
                  {({ loading, data, error, fetchMore }) => (
                    <QueryHandler
                      model="shipments"
                      loading={loading}
                      data={data}
                      fetchMore={fetchMore}
                      error={error}
                      onChangePage={({ nodes: shipmentItems }) => {
                        const totalShipment = shipmentItems.length;
                        if (totalShipment !== total) {
                          setShipmentToggle('total', totalShipment);
                        }
                      }}
                    >
                      {({
                        nodes: shipmentNodes,
                        hasMore: hasMoreShipment,
                        loadMore: loadMoreShipment,
                      }) => (
                        <div className={ShipmentListWrapperStyle}>
                          <RelationView
                            className={ShipmentListBodyStyle}
                            isEmpty={shipmentNodes ? shipmentNodes.length === 0 : true}
                            emptyMessage={
                              <FormattedMessage
                                id="modules.Orders.noShipmentFound"
                                defaultMessage="No shipments found"
                              />
                            }
                            hasMore={hasMoreShipment}
                            onLoadMore={loadMoreShipment}
                            customRender={() =>
                              shipmentNodes.map(shipmentNode => (
                                <BooleanValue defaultValue key={shipmentNode.id}>
                                  {({ value: isCollapsed, toggle }) => (
                                    <Item
                                      onToggle={toggle}
                                      isCollapsed={isCollapsed}
                                      relation={{
                                        type: isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT',
                                        id: shipmentNode.id,
                                      }}
                                      itemData={{
                                        data: shipmentNode,
                                        relation: {
                                          order: {},
                                          orderItem: {},
                                          batch: {},
                                          shipment: {},
                                        },
                                      }}
                                      itemType="shipment"
                                    />
                                  )}
                                </BooleanValue>
                              ))
                            }
                          />
                        </div>
                      )}
                    </QueryHandler>
                  )}
                </Query>
              );
            }
            return (
              <div className={ShipmentListWrapperStyle}>
                <div className={ShipmentListBodyStyle}>
                  <ShipmentList shipment={shipment} result={result.shipment} />
                </div>
              </div>
            );
          }}
        </ShipmentToggleValue>
      )}
    </Subscribe>

    <SlideForm />
    <DeleteDialog />
  </>
);

OrderFocused.defaultProps = defaultProps;

export default OrderFocused;
