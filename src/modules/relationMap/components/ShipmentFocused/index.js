// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue, BooleanValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import LoadingIcon from 'components/LoadingIcon';
import {
  generateShipmentRelation,
  formatOrderFromShipment,
  formatShipmentData,
} from 'modules/relationMap/util';
import query from './query';
import RelationView from '../RelationView';
import Item from '../OrderElement';
import SummaryBadge from '../SummaryBadge';
import { ScrollWrapperStyle, ShipmentMapWrapperStyle } from '../../style';

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
  perPage: 2,
};

const ShipmentFocused = ({ page, perPage, filter, sort }: Props) => (
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
      const shipments = getByPathWithDefault([], 'shipments.nodes', data);
      const nextPage = getByPathWithDefault(1, `shipments.page`, data) + 1;
      const totalPage = getByPathWithDefault(1, `shipments.totalPage`, data);
      const hasMore: boolean = nextPage <= totalPage;
      const formattedShipment = formatShipmentData(shipments);
      const orderObj = formatOrderFromShipment(shipments);
      return (
        <React.Fragment>
          <SummaryBadge
            icon="ORDER"
            color="ORDER"
            label="ORDERS"
            no={formattedShipment.sumOrders}
          />
          <SummaryBadge
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            label="ITEMS"
            no={formattedShipment.sumOrderItems}
          />
          <SummaryBadge
            icon="BATCH"
            color="BATCH"
            label="BATCHES"
            no={formattedShipment.sumBatches}
          />
          <SummaryBadge
            icon="SHIPMENT"
            color="SHIPMENT"
            label="SHIPMENTS"
            no={formattedShipment.sumShipments}
          />
          <ObjectValue defaultValue={{ selectedItem: '', focusedItem: null }}>
            {({ value: { focusedItem }, set: setItem }) => (
              <React.Fragment>
                <div className={ScrollWrapperStyle}>
                  {Object.keys(orderObj).map(orderId => {
                    const order = orderObj[orderId];
                    const orderRefs = Object.keys(order.refs);
                    return (
                      <Item
                        key={orderId}
                        type="ORDER"
                        data={formattedShipment.orderObj[orderId]}
                        isFocused={Object.keys(focusedItem || {}).some(focusId =>
                          orderRefs.some(shipmentId => shipmentId === focusId)
                        )}
                        onMouseEnter={() => setItem('focusedItem', order.refs)}
                        onMouseLeave={() => setItem('focusedItem', null)}
                      />
                    );
                  })}
                </div>
                <RelationView
                  className={ShipmentMapWrapperStyle}
                  items={shipments}
                  itemWidth={200}
                  isEmpty={shipments.length === 0}
                  spacing={0}
                  emptyMessage="No shipments found"
                  hasMore={hasMore}
                  onLoadMore={() => loadMore({ fetchMore, data }, {}, 'shipments')}
                  render={({ item }) => (
                    <BooleanValue defaultValue key={item.id}>
                      {({ value: isCollapsed, toggle }) => {
                        const relations = generateShipmentRelation(item, { isCollapsed });
                        return relations.map((relation, relationIndex) => {
                          const key = `relation-${relationIndex}`;
                          let itemData;
                          switch (relation.type) {
                            case 'ORDER':
                              itemData = formattedShipment.orderObj[relation.id];
                              break;
                            case 'ORDER_ITEM':
                              itemData = formattedShipment.orderItemObj[relation.id];
                              break;
                            case 'BATCH':
                              itemData = formattedShipment.batchObj[relation.id];
                              break;
                            case 'ORDER_ITEM_ALL':
                            case 'BATCH_ALL':
                              itemData = formattedShipment.shipmentObj[relation.id];
                              break;
                            case 'SHIPMENT':
                              itemData = formattedShipment.shipmentObj[relation.id].data;
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
        </React.Fragment>
      );
    }}
  </Query>
);

ShipmentFocused.defaultProps = defaultProps;

export default ShipmentFocused;
