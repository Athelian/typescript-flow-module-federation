// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { Query } from 'react-apollo';
import { isEmpty } from 'utils/fp';
import { ActionContainer } from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';
import LoadingIcon from 'components/LoadingIcon';
import OrderFocused from './orderFocused';
import query from './orderFocused/query';
import { formatNodes, formatOrders as formatOrderData } from './orderFocused/formatter';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import ScrollToResult from './common/ScrollToResult';
import SummaryBadge from './common/SummaryBadge';
import { ActionSubscribe } from './common/ActionPanel';
import { SortFilter, SortFilterHandler } from './common/SortFilter';
import { FunctionWrapperStyle, BadgeWrapperStyle, RelationMapGridStyle } from './style';

const Order = () => (
  <Layout>
    <SortFilterHandler>
      {({ sort, filter, onChangeSortFilter, page, perPage }) => {
        const filterVariables = {
          page,
          perPage,
          filterBy: { ...filter },
          sortBy: { [sort.field]: sort.direction },
        };
        return (
          <Query query={query} variables={filterVariables} fetchPolicy="network-only">
            {({ loading, data, fetchMore, error }) => (
              <Subscribe to={[ActionContainer]}>
                {({ state: { result, scrolled }, setScroll }) => (
                  <QueryHandler
                    model="orders"
                    filter={{ perPage }}
                    data={data}
                    fetchMore={fetchMore}
                    error={error}
                  >
                    {({ nodes, hasMore, loadMore }) => {
                      const formatedNodes =
                        isEmpty(result) || !nodes ? nodes : formatNodes(nodes, result);
                      const order = formatOrderData(formatedNodes || []);
                      // console.log('formatedNodes', formatedNodes, order);
                      return (
                        <>
                          <ActionSubscribe filter={filterVariables} />
                          <Subscribe to={[ActionContainer]}>
                            {({ clearResult }) => (
                              <SortFilter
                                sort={sort}
                                filter={filter}
                                onChange={newFilter => {
                                  onChangeSortFilter(newFilter);
                                  clearResult();
                                }}
                                className={FunctionWrapperStyle}
                              />
                            )}
                          </Subscribe>

                          {loading ? (
                            <LoadingIcon />
                          ) : (
                            <div className={RelationMapGridStyle}>
                              <Subscribe to={[RelationMapContainer]}>
                                {({ selectAll, unSelectAll, state: { targetedItem } }) => (
                                  <div className={BadgeWrapperStyle}>
                                    <SummaryBadge
                                      summary={order}
                                      targetedItem={targetedItem}
                                      unSelectAll={unSelectAll}
                                      selectAll={selectAll(order)}
                                    />
                                  </div>
                                )}
                              </Subscribe>

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
                                    nodes={formatedNodes}
                                  />
                                )}
                              </ScrollToResult>
                            </div>
                          )}
                        </>
                      );
                    }}
                  </QueryHandler>
                )}
              </Subscribe>
            )}
          </Query>
        );
      }}
    </SortFilterHandler>
  </Layout>
);

export default Order;
