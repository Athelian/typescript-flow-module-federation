// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { formatOrderFromShipment, formatShipmentData } from 'modules/relationMap/util';
import ShipmentFocused from './components/ShipmentFocused';
import Layout from './components/Layout';
import QueryHandler from './components/QueryHandler';
import SortFilterBar from './components/SortFilterBar';
import SummaryBadge from './components/SummaryBadge';
import query from './components/ShipmentFocused/query';
import { FunctionWrapperStyle, BadgeWrapperStyle } from './style';

type Props = {
  page: number,
  perPage: number,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};

const Order = ({ page, perPage }: Props) => (
  <Layout>
    <SortFilterBar className={FunctionWrapperStyle}>
      {({ sort, filter }) => (
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
          {({ loading, data, fetchMore, error }) => (
            <QueryHandler
              model="shipments"
              loading={loading}
              data={data}
              fetchMore={fetchMore}
              error={error}
            >
              {({ nodes, hasMore, loadMore }) => {
                const shipment = formatShipmentData(nodes);
                const order = formatOrderFromShipment(nodes);
                return (
                  <>
                    <div className={BadgeWrapperStyle}>
                      <SummaryBadge
                        icon="ORDER"
                        color="ORDER"
                        label="ORDERS"
                        no={shipment.sumOrders}
                      />
                      <SummaryBadge
                        icon="ORDER_ITEM"
                        color="ORDER_ITEM"
                        label="ITEMS"
                        no={shipment.sumOrderItems}
                      />
                      <SummaryBadge
                        icon="BATCH"
                        color="BATCH"
                        label="BATCHES"
                        no={shipment.sumBatches}
                      />
                      <SummaryBadge
                        icon="SHIPMENT"
                        color="SHIPMENT"
                        label="SHIPMENTS"
                        no={shipment.sumShipments}
                      />
                    </div>
                    <ShipmentFocused
                      order={order}
                      shipment={shipment}
                      hasMore={hasMore}
                      loadMore={loadMore}
                      nodes={nodes}
                    />
                  </>
                );
              }}
            </QueryHandler>
          )}
        </Query>
      )}
    </SortFilterBar>
  </Layout>
);
Order.defaultProps = defaultProps;
export default Order;
