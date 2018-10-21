/* eslint no-await-in-loop: 0 */
// @flow
import * as React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { formatOrderData } from 'modules/relationMap/util';
import messages from 'modules/relationMap/messages';
// import { createBatchMutation } from 'modules/batch/form/mutation';
import { BaseButton } from 'components/Buttons';
// import { getByPathWithDefault } from 'utils/fp';
import OrderFocused, { FocusedValue } from './orderFocused';
import query from './orderFocused/query';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import SummaryBadge from './common/SummaryBadge';
import ToggleTag from './common/ToggleTag';
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

// type State = {
//   result: {
//     order: Object,
//     orderItem: Object,
//     batch: Object,
//     shipment: Object,
//   },
// };
const defaultProps = {
  page: 1,
  perPage: 10,
};

class Order extends React.Component<Props> {
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
  // clone = async (client, target) => {
  //   const { order, orderItem, batch, shipment } = target;
  //   const batchIds = Object.keys(batch);
  //   const newResult = {
  //     order: {},
  //     orderItem: {},
  //     batch: batchIds.reduce((obj, batchId) => ({ ...obj, [batchId]: [] }), {}),
  //     shipment: {},
  //   };
  //   console.log('init result ####', newResult);
  //   Object.keys(order).forEach(orderId => {
  //     console.log('order', order[orderId]);
  //   });
  //   Object.keys(orderItem).forEach(orderItemId => {
  //     console.log('orderItem', orderItem[orderItemId]);
  //   });
  //   const batchRequest = batchIds.reduce((obj, batchId) => {
  //     const request = client.mutate({
  //       mutation: createBatchMutation,
  //       variables: {
  //         input: {
  //           no: `[clone] ${batch[batchId].no}`,
  //           quantity: batch[batchId].quantity,
  //           orderItemId: batch[batchId].orderItem.id,
  //         },
  //       },
  //     });
  //     return { ...obj, [batchId]: [request] };
  //   }, {});
  //   Object.keys(shipment).forEach(shipmentId => {
  //     console.log('shipment', shipment[shipmentId]);
  //   });
  //   const newBatchIds = [];
  //   for (let index = 0; index < batchIds.length; index += 1) {
  //     const batchId = batchIds[index];
  //     const responses = await Promise.all(batchRequest[batchId]);
  //     newResult.batch = responses.reduce((batchResult, res) => {
  //       const id = getByPathWithDefault(null, 'data.batchCreate.batch.id', res);
  //       if (id) {
  //         batchResult[batchId].push(id);
  //         newBatchIds.push(id);
  //       }
  //       return batchResult;
  //     }, newResult.batch);
  //   }
  //   return {
  //     resultId: {
  //       batchIds: newBatchIds,
  //     },
  //     result: {
  //       batch: newResult.batch,
  //     },
  //   };
  // };

  render() {
    const { page, perPage, intl } = this.props;
    // const { result, resultId } = this.state;
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
