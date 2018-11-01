// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { formatOrderFromShipment, formatShipmentData } from 'modules/relationMap/util';
import ShipmentFocused from './shipmentFocused';
import query from './shipmentFocused/query';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import SortFilterBar from './common/SortFilterBar';
import SummaryBadge from './common/SummaryBadge';
import ToggleTag from './common/ToggleTag';
import { FunctionWrapperStyle, BadgeWrapperStyle, TagWrapperStyle, RelationMapGrid } from './style';

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
    <RelationMapGrid>
      <div className={TagWrapperStyle}>
        <ToggleTag />
      </div>
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
                        <SummaryBadge summary={shipment} />
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
    </RelationMapGrid>
  </Layout>
);
Order.defaultProps = defaultProps;
export default Order;
