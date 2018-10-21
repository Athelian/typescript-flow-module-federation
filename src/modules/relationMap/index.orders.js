// @flow
import * as React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { formatOrderData } from 'modules/relationMap/util';
import messages from 'modules/relationMap/messages';
import { BaseButton } from 'components/Buttons';
import OrderFocused from './orderFocused';
import query from './orderFocused/query';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import SummaryBadge from './common/SummaryBadge';
import ToggleTag from './common/ToggleTag';
import FocusedValue from './common/FocusedValue';
import ActionSelector from './common/ActionPanel/ActionSelector';
import { SortFilter, SortFilterHandler } from './common/SortFilter';
import { ActionContainer } from './containers';
import {
  FunctionWrapperStyle,
  BadgeWrapperStyle,
  TagWrapperStyle,
  RelationMapGrid,
  FullGridWrapperStyle,
} from './style';

type Props = {
  page: number,
  perPage: number,
  intl: IntlShape,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};

class Order extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);
    const { intl } = props;
    this.sortInputs = [
      { title: intl.formatMessage(messages.poSort), value: 'poNo' },
      { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
      { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
    ];
  }

  sortInputs: Array<Object>;

  render() {
    const { page, perPage, intl } = this.props;
    return (
      <Layout>
        <RelationMapGrid>
          <ApolloConsumer>
            {client => (
              <SortFilterHandler>
                {({ sort, filter, onChangeFilter }) => (
                  <ActionContainer>
                    {({ clone, result, setResult }) => (
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
                        {({ loading, data, fetchMore, error, refetch }) => (
                          <>
                            <FocusedValue>
                              {({ value: { focusMode, focusedItem } }) =>
                                focusMode === 'TARGET' && (
                                  <div className={FullGridWrapperStyle}>
                                    <ActionSelector target={focusedItem}>
                                      <BaseButton
                                        icon="CLONE"
                                        label="CLONE"
                                        backgroundColor="TEAL"
                                        hoverBackgroundColor="TEAL_DARK"
                                        onClick={async () => {
                                          const newState = await clone(client, focusedItem);
                                          await refetch({ page, perPage });
                                          setResult(newState);
                                        }}
                                      />
                                      <BaseButton
                                        icon="SPLIT"
                                        label="SPLIT"
                                        backgroundColor="TEAL"
                                        s
                                        hoverBackgroundColor="TEAL_DARK"
                                        onClick={() => {}}
                                      />
                                      <BaseButton
                                        icon="EDIT"
                                        label="EDIT"
                                        backgroundColor="TEAL"
                                        hoverBackgroundColor="TEAL_DARK"
                                        onClick={() => {}}
                                      />
                                      <BaseButton
                                        icon="CONNECT"
                                        label="CONNECT"
                                        backgroundColor="TEAL"
                                        hoverBackgroundColor="TEAL_DARK"
                                        onClick={() => {}}
                                      />
                                    </ActionSelector>
                                  </div>
                                )
                              }
                            </FocusedValue>
                            <div className={TagWrapperStyle}>
                              <ToggleTag />
                            </div>
                            <SortFilter
                              sort={sort}
                              filter={filter}
                              onChange={onChangeFilter}
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
                                      result={result}
                                    />
                                  </>
                                );
                              }}
                            </QueryHandler>
                          </>
                        )}
                      </Query>
                    )}
                  </ActionContainer>
                )}
              </SortFilterHandler>
            )}
          </ApolloConsumer>
        </RelationMapGrid>
      </Layout>
    );
  }
}

export default injectIntl(Order);
