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
import SummaryBadge from './common/SummaryBadge';
import ToggleTag from './common/ToggleTag';
import { ActionSubscribe } from './common/ActionPanel';
import { SortFilter, SortFilterHandler } from './common/SortFilter';
import { FunctionWrapperStyle, BadgeWrapperStyle, TagWrapperStyle, RelationMapGrid } from './style';

type Props = {
  page: number,
  perPage: number,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};
class Order extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { page, perPage } = this.props;
    return (
      <Layout>
        <SortFilterHandler>
          {({ sort, filter, onChangeSortFilter }) => (
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
            >
              {({ loading, data, fetchMore, error, refetch }) => (
                <>
                  <ActionSubscribe refetch={() => refetch({ page, perPage })} />
                  <div className={TagWrapperStyle}>
                    <ToggleTag />
                  </div>
                  <SortFilter
                    sort={sort}
                    filter={filter}
                    onChange={onChangeSortFilter}
                    className={FunctionWrapperStyle}
                  />
                  <QueryHandler
                    model="orders"
                    loading={loading}
                    data={data}
                    fetchMore={fetchMore}
                    error={error}
                  >
                    {({ nodes, hasMore, loadMore }) => {
                      const order = formatOrderData(nodes || []);
                      return (
                        <RelationMapGrid>
                          <Subscribe to={[RelationMapContainer]}>
                            {({ selectAll }) => (
                              <div className={BadgeWrapperStyle}>
                                <SummaryBadge summary={order} selectAll={selectAll(order)} />
                              </div>
                            )}
                          </Subscribe>
                          <Subscribe to={[ActionContainer]}>
                            {({ state: { result } }) => (
                              <OrderFocused
                                order={order}
                                hasMore={hasMore}
                                loadMore={loadMore}
                                nodes={isEmpty(result) ? nodes : formatNodes(nodes, result)}
                              />
                            )}
                          </Subscribe>
                        </RelationMapGrid>
                      );
                    }}
                  </QueryHandler>
                </>
              )}
            </Query>
          )}
        </SortFilterHandler>
      </Layout>
    );
  }
}

export default Order;
