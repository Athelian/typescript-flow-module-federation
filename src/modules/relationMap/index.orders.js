// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { Query } from 'react-apollo';
import { isEmpty } from 'utils/fp';
import { formatOrderData } from 'modules/relationMap/util';
import { ActionContainer } from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';
import LoadingIcon from 'components/LoadingIcon';
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
              <QueryHandler
                model="orders"
                filter={{ perPage }}
                data={data}
                fetchMore={fetchMore}
                error={error}
              >
                {({ nodes, hasMore, loadMore }) => {
                  const order = formatOrderData(nodes || []);
                  return (
                    <>
                      <ActionSubscribe />
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
                        <RelationMapGrid>
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
                                    nodes={
                                      isEmpty(result) || !nodes ? nodes : formatNodes(nodes, result)
                                    }
                                  />
                                )}
                              </ScrollToResult>
                            )}
                          </Subscribe>
                        </RelationMapGrid>
                      )}
                    </>
                  );
                }}
              </QueryHandler>
            )}
          </Query>
        );
      }}
    </SortFilterHandler>
  </Layout>
);

export default Order;
