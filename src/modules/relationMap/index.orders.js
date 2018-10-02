// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { formatShipmentOrder, formatOrderData } from 'modules/relationMap/util';

import OrderFocused from './components/OrderFocused';
import Layout from './components/Layout';
import QueryHandler from './components/QueryHandler';
import SortFilterBar from './components/SortFilterBar';
import SummaryBadge from './components/SummaryBadge';
import ToggleTag from './components/ToggleTag';
import query from './components/OrderFocused/query';
import { FunctionWrapperStyle, BadgeWrapperStyle, TagWrapperStyle, RelationMapGrid } from './style';

type Props = {
  page: number,
  perPage: number,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};

const sortInput = [
  { title: 'Updated At', value: 'updatedAt' },
  { title: 'Created At', value: 'createdAt' },
  { title: 'Po No', value: 'poNo' },
];

const Order = ({ page, perPage }: Props) => (
  <Layout>
    <RelationMapGrid>
      <div className={TagWrapperStyle}>
        <ToggleTag />
      </div>
      <SortFilterBar className={FunctionWrapperStyle} sortInput={sortInput}>
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
                    <>
                      <div className={BadgeWrapperStyle}>
                        <SummaryBadge
                          icon="ORDER"
                          color="ORDER"
                          label="ORDERS"
                          no={order.sumOrders}
                        />
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
                      </div>
                      <OrderFocused
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
    </RelationMapGrid>
  </Layout>
);
Order.defaultProps = defaultProps;
export default Order;
