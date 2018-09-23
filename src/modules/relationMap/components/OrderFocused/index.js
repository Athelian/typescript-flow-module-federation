// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue, BooleanValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import LoadingIcon from 'components/LoadingIcon';
import {
  generateOrderRelation,
  formatShipmentOrder,
  formatOrderData,
} from 'modules/relationMap/util';
import query from './query';
import RelationView from '../RelationView';
import Item from '../OrderElement';
import SummaryBadge from '../SummaryBadge';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from '../../style';

type OptionalProps = {
  page: number,
  perPage: number,
};

type Props = OptionalProps & {
  filter: string,
  sort: {
    field: string,
    direction: string,
  },
};

const defaultProps = {
  page: 1,
  perPage: 12,
};

const OrderFocused = ({ page, perPage, filter, sort }: Props) => (
  <Query
    query={query}
    variables={{
      page,
      perPage,
      filterBy: {
        query: filter,
      },
      sortBy: {
        [sort.field]: sort.direction,
      },
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }
      if (loading) {
        return <LoadingIcon />;
      }
      const orders = getByPathWithDefault([], 'orders.nodes', data);
      const nextPage = getByPathWithDefault(1, `orders.page`, data) + 1;
      const totalPage = getByPathWithDefault(1, `orders.totalPage`, data);
      const hasMore: boolean = nextPage <= totalPage;
      const formattedOrder = formatOrderData(orders);
      const shipmentObj = formatShipmentOrder(orders);
      console.log('formattedOrder', formattedOrder);
      return (
        <React.Fragment>
          <SummaryBadge icon="ORDER" color="ORDER" label="ORDERS" no={formattedOrder.sumOrders} />
          <SummaryBadge
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            label="ITEMS"
            no={formattedOrder.sumOrderItems}
          />
          <SummaryBadge icon="BATCH" color="BATCH" label="BATCHES" no={formattedOrder.sumBatches} />
          <SummaryBadge
            icon="SHIPMENT"
            color="SHIPMENT"
            label="SHIPMENTS"
            no={formattedOrder.sumShipments}
          />
          <ObjectValue defaultValue={{ selectedItem: '', focusedItem: null }}>
            {({ value: { focusedItem }, set: setItem }) => (
              <React.Fragment>
                <RelationView
                  className={OrderMapWrapperStyle}
                  items={orders}
                  itemWidth={200}
                  isEmpty={orders.length === 0}
                  spacing={0}
                  emptyMessage="No orders found"
                  hasMore={hasMore}
                  onLoadMore={() => loadMore({ fetchMore, data }, {}, 'shipments')}
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
                              itemData = formattedOrder.orderObj[relation.id];
                              break;
                            case 'ORDER_ITEM':
                              itemData = formattedOrder.orderItemObj[relation.id];
                              break;
                            case 'BATCH':
                              itemData = formattedOrder.batchObj[relation.id];
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
                  {Object.keys(shipmentObj).map(shipmentId => {
                    const shipment = shipmentObj[shipmentId];
                    const shipmentRefs = Object.keys(shipment.refs);
                    return (
                      <Item
                        key={shipmentId}
                        type="SHIPMENT"
                        data={shipment.data}
                        isFocused={Boolean(
                          Object.keys(focusedItem || {}).some(focusId =>
                            shipmentRefs.some(orderId => orderId === focusId)
                          )
                        )}
                        onMouseLeave={() => setItem('focusedItem', null)}
                        onMouseEnter={() => setItem('focusedItem', shipment.refs)}
                      />
                    );
                  })}
                </div>
              </React.Fragment>
            )}
          </ObjectValue>
        </React.Fragment>
      );
    }}
  </Query>
);

OrderFocused.defaultProps = defaultProps;

export default OrderFocused;
