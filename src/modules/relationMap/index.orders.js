// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { formatShipmentOrder, formatOrderData } from 'modules/relationMap/util';
import OrderFocused from './components/OrderFocused';
import Layout from './components/Layout';
import QueryHandler from './components/QueryHandler';
import SortFilterBar from './components/SortFilterBar';
import SummaryBadge from './components/SummaryBadge';
import query from './components/OrderFocused/query';
import { FunctionWrapperStyle } from './style';

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
              model="orders"
              loading={loading}
              data={data}
              fetchMore={fetchMore}
              error={error}
            >
              {({ nodes, hasMore, loadMore }) => {
                const order = formatOrderData(nodes);
                const shipment = formatShipmentOrder(nodes);
                return (
                  <React.Fragment>
                    <SummaryBadge icon="ORDER" color="ORDER" label="ORDERS" no={order.sumOrders} />
                    <SummaryBadge
                      icon="ORDER_ITEM"
                      color="ORDER_ITEM"
                      label="ITEMS"
                      no={order.sumOrderItems}
                    />
                    <SummaryBadge
                      icon="BATCH"
                      color="BATCH"
                      label="BATCHES"
                      no={order.sumBatches}
                    />
                    <SummaryBadge
                      icon="SHIPMENT"
                      color="SHIPMENT"
                      label="SHIPMENTS"
                      no={order.sumShipments}
                    />
                    <OrderFocused
                      order={order}
                      shipment={shipment}
                      hasMore={hasMore}
                      loadMore={loadMore}
                      nodes={nodes}
                    />
                  </React.Fragment>
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
