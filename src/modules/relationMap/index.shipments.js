// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { formatOrderFromShipment, formatShipmentData } from 'modules/relationMap/util';
import ShipmentFocused from './shipmentFocused';
import query from './shipmentFocused/query';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import SummaryBadge from './common/SummaryBadge';
import ToggleTag from './common/ToggleTag';
import { BadgeWrapperStyle, TagWrapperStyle, RelationMapGrid } from './style';

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
      <Query
        query={query}
        variables={{
          page,
          perPage,
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
                    <SummaryBadge summary={shipment} targetedItem={{}} />
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
    </RelationMapGrid>
  </Layout>
);
Order.defaultProps = defaultProps;
export default Order;
