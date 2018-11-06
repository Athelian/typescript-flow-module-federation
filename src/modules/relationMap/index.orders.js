// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { Query } from 'react-apollo';
import { isEmpty } from 'utils/fp';
import { formatOrderData } from 'modules/relationMap/util';
import { ActionContainer } from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';
import OrderFocused from './orderFocused';
import query from './orderFocused/query';
import { formatNodes } from './orderFocused/formatter';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import ScrollToResult from './common/ScrollToResult';
import SummaryBadge from './common/SummaryBadge';
import { ActionSubscribe } from './common/ActionPanel';
import { SortFilter, SortFilterHandler } from './common/SortFilter';
import { FunctionWrapperStyle, BadgeWrapperStyle, RelationMapGrid } from './style';

const Order = () => (
  <Layout>
    <SortFilterHandler>
      {({ sort, filter, onChangeSortFilter, page, perPage }) => (
        <Query
          query={query}
          variables={{
            page,
            perPage,
            filterBy: {
              ...filter,
            },
            sortBy: {
              [sort.field]: sort.direction,
            },
          }}
          fetchPolicy="network-only"
          partialRefetch
        >
          {({ loading, data, fetchMore, error, refetch }) => (
            <QueryHandler
              model="orders"
              filter={{ perPage }}
              loading={loading}
              data={data}
              fetchMore={fetchMore}
              error={error}
            >
              {({ nodes, hasMore, loadMore, currentPage }) => {
                const order = formatOrderData(nodes || []);
                return (
                  <>
                    <ActionSubscribe refetch={() => refetch({ perPage: currentPage * perPage })} />
                    <SortFilter
                      sort={sort}
                      filter={filter}
                      onChange={onChangeSortFilter}
                      className={FunctionWrapperStyle}
                    />
                    <RelationMapGrid>
                      <Subscribe to={[RelationMapContainer]}>
                        {({ selectAll, unSelectAll }) => (
                          <div className={BadgeWrapperStyle}>
                            <SummaryBadge
                              summary={order}
                              unSelectAll={unSelectAll}
                              selectAll={selectAll(order)}
                            />
                          </div>
                        )}
                      </Subscribe>
                      <Subscribe to={[ActionContainer]}>
                        {({ state: { result, scrolled }, setScroll }) => (
                          <ScrollToResult
                            id="OrderMapWrapper"
                            result={result}
                            scrolled={scrolled}
                            setScroll={setScroll}
                          >
                            {({ id }) => (
                              <OrderFocused
                                id={id}
                                order={order}
                                hasMore={hasMore}
                                loadMore={loadMore}
                                nodes={isEmpty(result) ? nodes : formatNodes(nodes, result)}
                              />
                            )}
                          </ScrollToResult>
                        )}
                      </Subscribe>
                    </RelationMapGrid>
                  </>
                );
              }}
            </QueryHandler>
          )}
        </Query>
      )}
    </SortFilterHandler>
  </Layout>
);

export default Order;
