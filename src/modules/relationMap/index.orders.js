// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
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
import AdvancedFilter from './common/SortFilter/AdvancedFilter';
import { FunctionWrapperStyle, BadgeWrapperStyle, RelationMapGridStyle } from './style';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

const Order = ({ intl }: Props) => (
  <Layout>
    <SortFilterHandler filter={{ archived: false }}>
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
                      return (
                        <>
                          <ActionSubscribe filter={filterVariables} />
                          <Subscribe to={[ActionContainer]}>
                            {({ clearResult }) => (
                              <SortFilter
                                sort={sort}
                                sortInputs={[
                                  {
                                    title: intl.formatMessage(messages.poNoSort),
                                    value: 'ids',
                                  },
                                  {
                                    title: intl.formatMessage(messages.piNoSort),
                                    value: 'piNo',
                                  },
                                  {
                                    title: intl.formatMessage(messages.issuedAtSort),
                                    value: 'issuedAt',
                                  },
                                  {
                                    title: intl.formatMessage(messages.exporterSort),
                                    value: 'exporter',
                                  },
                                  {
                                    title: intl.formatMessage(messages.currencySort),
                                    value: 'currency',
                                  },
                                  {
                                    title: intl.formatMessage(messages.incotermSort),
                                    value: 'incoterm',
                                  },
                                  {
                                    title: intl.formatMessage(messages.deliveryPlaceSort),
                                    value: 'deliveryPlace',
                                  },
                                  {
                                    title: intl.formatMessage(messages.updatedAtSort),
                                    value: 'updatedAt',
                                  },
                                  {
                                    title: intl.formatMessage(messages.createdAtSort),
                                    value: 'createdAt',
                                  },
                                ]}
                                filter={filter}
                                onChange={newFilter => {
                                  onChangeSortFilter(newFilter);
                                  clearResult();
                                }}
                                renderAdvanceFilter={({ onChange: onApplyFilter }) => (
                                  <AdvancedFilter
                                    initialFilter={{
                                      query: '',
                                    }}
                                    onApply={onApplyFilter}
                                  />
                                )}
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

export default injectIntl(Order);
