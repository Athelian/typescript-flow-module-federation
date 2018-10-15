// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { formatOrderData } from 'modules/relationMap/util';
import messages from 'modules/relationMap/messages';
import OrderFocused from './orderFocused';
import query from './orderFocused/query';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import SortFilterBar from './common/SortFilterBar';
import SummaryBadge from './common/SummaryBadge';
import ToggleTag from './common/ToggleTag';
import { FunctionWrapperStyle, BadgeWrapperStyle, TagWrapperStyle, RelationMapGrid } from './style';

type Props = {
  page: number,
  perPage: number,
  intl: IntlShape,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};

const Order = ({ page, perPage, intl }: Props) => {
  const sortInput = [
    { title: intl.formatMessage(messages.poSort), value: 'poNo' },
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  return (
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
                    return (
                      <>
                        <div className={BadgeWrapperStyle}>
                          <SummaryBadge
                            icon="ORDER"
                            color="ORDER"
                            label={intl.formatMessage(messages.ordersLabel)}
                            no={order.sumOrders}
                          />
                          <SummaryBadge
                            icon="ORDER_ITEM"
                            color="ORDER_ITEM"
                            label={intl.formatMessage(messages.itemsLabel)}
                            no={order.sumOrderItems}
                          />
                          <SummaryBadge
                            icon="BATCH"
                            color="BATCH"
                            label={intl.formatMessage(messages.batchesLabel)}
                            no={order.sumBatches}
                          />
                          <SummaryBadge
                            icon="SHIPMENT"
                            color="SHIPMENT"
                            label={intl.formatMessage(messages.shipmentsLabel)}
                            no={order.sumShipments}
                          />
                        </div>
                        <OrderFocused
                          order={order}
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
};
Order.defaultProps = defaultProps;
export default injectIntl(Order);
