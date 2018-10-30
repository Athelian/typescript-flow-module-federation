// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { Query, ApolloConsumer } from 'react-apollo';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { isEmpty } from 'utils/fp';
import { formatOrderData } from 'modules/relationMap/util';
import { BaseButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import OrderFocused from './orderFocused';
import query from './orderFocused/query';
import { formatNodes } from './orderFocused/formatter';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import SummaryBadge from './common/SummaryBadge';
import ToggleTag from './common/ToggleTag';
import ActionSelector from './common/ActionPanel/ActionSelector';
import { SortFilter, SortFilterHandler } from './common/SortFilter';
import TableInlineEdit from './common/TableInlineEdit';
import { ActionContainer } from './containers';
import RelationMapContainer from './container';
import messages from './messages';
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

  render() {
    const { page, perPage, intl } = this.props;
    return (
      <Layout>
        <RelationMapGrid>
          <ApolloConsumer>
            {client => (
              <SortFilterHandler>
                {({ sort, filter, onChangeSortFilter }) => (
                  <ActionContainer>
                    {({ getCloneFunction, result, setResult }) => (
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
                            <Subscribe to={[RelationMapContainer]}>
                              {({
                                state: { focusMode, focusedItem },
                                isTargetTreeMode,
                                isTargetMode,
                                selectItem,
                              }) =>
                                (isTargetMode() || isTargetTreeMode()) && (
                                  <div className={FullGridWrapperStyle}>
                                    <ActionSelector target={focusedItem}>
                                      <BaseButton
                                        icon="CLONE"
                                        label="CLONE"
                                        backgroundColor="TEAL"
                                        hoverBackgroundColor="TEAL_DARK"
                                        onClick={async () => {
                                          const clone = getCloneFunction(focusMode);
                                          const [newResult, newFocus] = await clone(
                                            client,
                                            focusedItem
                                          );
                                          await refetch({ page, perPage });
                                          setResult(newResult);
                                          selectItem(newFocus);
                                        }}
                                      />
                                      <BaseButton
                                        icon="SPLIT"
                                        label="SPLIT"
                                        backgroundColor="TEAL"
                                        hoverBackgroundColor="TEAL_DARK"
                                        onClick={() => {}}
                                      />
                                      <BooleanValue>
                                        {({ value: opened, set: slideToggle }) => (
                                          <>
                                            <BaseButton
                                              icon="EDIT"
                                              label="EDIT"
                                              backgroundColor="TEAL"
                                              hoverBackgroundColor="TEAL_DARK"
                                              onClick={() => slideToggle(true)}
                                            />
                                            <SlideView
                                              isOpen={opened}
                                              onRequestClose={() => slideToggle(false)}
                                              options={{ width: '1030px' }}
                                            >
                                              {opened && (
                                                <TableInlineEdit
                                                  onSave={() => {}}
                                                  onExpand={() => {}}
                                                  onCancel={() => slideToggle(false)}
                                                />
                                              )}
                                            </SlideView>
                                          </>
                                        )}
                                      </BooleanValue>
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
                            </Subscribe>
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
                                const formattedNodes = isEmpty(result)
                                  ? nodes
                                  : formatNodes(nodes, result);
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
                                      nodes={formattedNodes}
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
