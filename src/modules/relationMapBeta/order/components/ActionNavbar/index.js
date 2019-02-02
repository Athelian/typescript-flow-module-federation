// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { intersection } from 'lodash';
import { BooleanValue } from 'react-values';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import { cleanUpData } from 'utils/data';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import SlideView from 'components/SlideView';
import { BaseButton } from 'components/Buttons';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { selectors, actionCreators } from 'modules/relationMapBeta/order/store';
import { orderDetailQuery } from 'modules/relationMapBeta/order/query';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'modules/relationMap/constants';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import {
  TabItemStyled,
  LoadingContainerStyle,
  MoveToWrapper,
} from 'modules/relationMap/common/ActionPanel/ActionSubscribe/style';
import messages from 'modules/relationMap/messages';
import TargetToolBar from './TargetToolBar';
import HighLightToolBar from './HighLightToolBar';
import ClonePanel from './ClonePanel';
import SplitPanel from './SplitPanel';
import SplitBalancePanel from './SplitBalancePanel';
import ConstraintPanel from './ConstraintPanel';
import MoveToOrderPanel from './MoveToOrderPanel';
import ErrorPanel from './ErrorPanel';
import { batchBalanceSplitMutation } from './SplitBalancePanel/mutation';
import { batchEqualSplitMutation, batchSimpleSplitMutation } from './SplitPanel/mutation';
import { cloneBatchMutation } from './ClonePanel/mutation';
import { updateOrderMutation, prepareUpdateOrderInput } from './MoveToOrderPanel/mutation';
import TableView from '../TableInlineEdit';

type Props = {
  highLightEntities: Array<string>,
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    shipments: Object,
  },
};

export default function ActionNavbar({ highLightEntities, entities }: Props) {
  const { orders, orderItems, batches } = entities;
  const [activeAction, setActiveAction] = React.useState('clone');
  const context = React.useContext(ActionDispatch);
  const { state, dispatch } = context;
  const uiSelectors = selectors(state);
  const actions = actionCreators(dispatch);
  return (
    <ApolloConsumer>
      {client => (
        <>
          {uiSelectors.isTargetAnyItem() && (
            <>
              <TargetToolBar
                totalOrder={uiSelectors.countTargetBy(ORDER)}
                totalOrderItem={uiSelectors.countTargetBy(ORDER_ITEM)}
                totalBatch={uiSelectors.countTargetBy(BATCH)}
                totalShipment={uiSelectors.countTargetBy(SHIPMENT)}
                onCancel={() => actions.clearAllBy('TARGET')}
              >
                <TabItem
                  className={TabItemStyled}
                  allowClickOnDisable
                  label={
                    <FormattedMessage
                      id="modules.RelationMaps.label.clone"
                      defaultMessage="CLONE"
                    />
                  }
                  icon="CLONE"
                  active={activeAction === 'clone'}
                  onClick={() => {
                    actions.selectOrderMode(false);
                    setActiveAction('clone');
                  }}
                />
                <TabItem
                  className={TabItemStyled}
                  allowClickOnDisable
                  label={
                    <FormattedMessage
                      id="modules.RelationMaps.label.split"
                      defaultMessage="SPLIT"
                    />
                  }
                  icon="SPLIT"
                  disabled={!uiSelectors.isAllowToSplitBatch()}
                  active={activeAction === 'split'}
                  onClick={() => {
                    actions.selectOrderMode(false);
                    setActiveAction('split');
                  }}
                />
                <TabItem
                  className={TabItemStyled}
                  allowClickOnDisable
                  label={
                    <div className={MoveToWrapper}>
                      <FormattedMessage {...messages.moveTo} />
                      <Icon icon="ORDER" />
                    </div>
                  }
                  icon="EXCHANGE"
                  disabled={!uiSelectors.isAllowToConnectOrder()}
                  active={activeAction === 'connectOrder'}
                  onClick={() => {
                    actions.selectOrderMode(true);
                    setActiveAction('connectOrder');
                  }}
                />
                <TabItem
                  className={TabItemStyled}
                  allowClickOnDisable
                  label={
                    <div className={MoveToWrapper}>
                      <FormattedMessage {...messages.moveTo} />
                      <Icon icon="SHIPMENT" />
                    </div>
                  }
                  icon="EXCHANGE"
                  disabled={!uiSelectors.isAllowToConnectShipment()}
                  active={activeAction === 'connectShipment'}
                  onClick={() => {
                    actions.selectOrderMode(false);
                    setActiveAction('connectShipment');
                  }}
                />
                <TabItem
                  className={TabItemStyled}
                  allowClickOnDisable
                  label={
                    <>
                      <FormattedMessage
                        id="modules.RelationMaps.label.autoFillBatch"
                        defaultMessage="AUTOFILL BATCH"
                      />
                      <Icon icon="BATCH" />
                    </>
                  }
                  icon="ORDER_ITEM"
                  disabled={!uiSelectors.isAllowToAutoFillBatch()}
                  active={activeAction === 'autoFillBatch'}
                  onClick={() => {
                    actions.selectOrderMode(false);
                    setActiveAction('autoFillBatch');
                  }}
                />
                <BooleanValue>
                  {({ value: opened, set: openTableView }) => (
                    <>
                      <BaseButton
                        icon="EDIT"
                        label={
                          <FormattedMessage
                            id="modules.RelationMaps.label.edit"
                            defaultMessage="EDIT"
                          />
                        }
                        backgroundColor="TEAL"
                        hoverBackgroundColor="TEAL_DARK"
                        onClick={() => openTableView(true)}
                      />
                      <SlideView
                        isOpen={opened}
                        onRequestClose={() => openTableView(false)}
                        options={{ width: '1030px' }}
                      >
                        {opened && (
                          <TableView entities={entities} onCancel={() => openTableView(false)} />
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              </TargetToolBar>
              {['split', 'autoFillBatch', 'connectOrder'].includes(activeAction) && (
                <ConstraintPanel
                  disable={{
                    disabledSplit: activeAction === 'split' && !uiSelectors.isAllowToSplitBatch(),
                    disableAutoFillBatch:
                      activeAction === 'autoFillBatch' && !uiSelectors.isAllowToAutoFillBatch(),
                    disabledMoveToShipment: false,
                    disabledMoveToOrder:
                      activeAction === 'connectOrder' && !uiSelectors.isAllowToConnectOrder(),
                  }}
                />
              )}
              {state.error && (
                <ErrorPanel
                  onClickCancel={() => actions.clearErrorMessage()}
                  onClickRefresh={() => window.location.reload()}
                />
              )}
              {activeAction && (
                <OutsideClickHandler ignoreClick onOutsideClick={() => {}}>
                  <Dialog isOpen={state.loading} options={{ width: 300 }} onRequestClose={() => {}}>
                    <div className={LoadingContainerStyle}>
                      <LoadingIcon />
                      <Label align="center">
                        <FormattedMessage {...messages[activeAction]} />
                      </Label>
                      <Label align="center">
                        <FormattedMessage {...messages.waiting} />
                      </Label>
                    </div>
                  </Dialog>
                </OutsideClickHandler>
              )}
              {activeAction === 'clone' && (
                <ClonePanel
                  onClick={async () => {
                    const batchIds = uiSelectors.targetedBatchIds();
                    const orderItemIds = [];
                    (Object.entries(orderItems): Array<any>).forEach(([orderItemId, orderItem]) => {
                      if (
                        !orderItemIds.includes(orderItemId) &&
                        intersection(orderItem.batches, batchIds).length > 0
                      ) {
                        orderItemIds.push(orderItemId);
                      }
                    });
                    const orderIds = [];
                    (Object.entries(orders): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, orderItemIds).length > 0
                      ) {
                        orderIds.push(orderId);
                      }
                    });
                    actions.cloneEntities({
                      type: BATCH,
                      ids: batchIds,
                    });
                    try {
                      const cloneBatches = await Promise.all(
                        batchIds.map(batchId =>
                          client.mutate({
                            mutation: cloneBatchMutation,
                            variables: { id: batchId, input: {} },
                            refetchQueries: orderIds.map(orderId => ({
                              query: orderDetailQuery,
                              variables: {
                                id: orderId,
                              },
                            })),
                          })
                        )
                      );
                      const result = cloneBatches.map((item, index) => ({
                        id: batchIds[index],
                        batch: getByPathWithDefault([], 'data.batchClone', item),
                      }));
                      actions.cloneEntitiesSuccess(result);
                    } catch (error) {
                      actions.cloneEntitiesFailed(error);
                    }
                  }}
                />
              )}
              {activeAction === 'autoFillBatch' && uiSelectors.isAllowToAutoFillBatch() && (
                <SplitBalancePanel
                  onClick={async () => {
                    const orderItemIds = uiSelectors.targetedOrderItemIds();
                    const orderIds = [];
                    (Object.entries(orders): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, orderItemIds).length > 0
                      ) {
                        orderIds.push(orderId);
                      }
                    });
                    actions.autoFillBatches(orderItemIds);
                    try {
                      const balanceSplitBatches = await Promise.all(
                        orderItemIds.map(orderItemId =>
                          client.mutate({
                            mutation: batchBalanceSplitMutation,
                            variables: { orderItemId },
                            refetchQueries: orderIds.map(orderId => ({
                              query: orderDetailQuery,
                              variables: {
                                id: orderId,
                              },
                            })),
                          })
                        )
                      );
                      const result = balanceSplitBatches.map((item, index) => ({
                        id: orderItemIds[index],
                        batches: getByPathWithDefault([], 'data.batchBalanceSplit.batches', item),
                      }));
                      actions.autoFillBatchesSuccess(result);
                    } catch (error) {
                      actions.autoFillBatchesFailed(error);
                    }
                  }}
                />
              )}
              {activeAction === 'connectOrder' && uiSelectors.isAllowToConnectOrder() && (
                <MoveToOrderPanel
                  hasSelectedOrderItem={uiSelectors.targetedOrderItemIds().length > 0}
                  hasSelectedOrder={uiSelectors.isSelectedOrder()}
                  hasSelectedAllBatches={uiSelectors.hasSelectedAllBatches(orderItems)}
                  currencies={uiSelectors.findAllCurrencies(orders, orderItems)}
                  onMoveToNewOrder={console.warn}
                  onMoveToExistOrder={async ({ currencies }) => {
                    const needToResetPrice = currencies.length > 1;
                    const orderItemIds = uiSelectors.targetedOrderItemIds();
                    const batchIds = uiSelectors.targetedBatchIds();
                    const allOrderItemIds = [...orderItemIds];
                    (Object.entries(orderItems): Array<any>).forEach(([orderItemId, orderItem]) => {
                      if (
                        !allOrderItemIds.includes(orderItemId) &&
                        intersection(orderItem.batches, batchIds).length > 0
                      ) {
                        allOrderItemIds.push(orderItemId);
                      }
                    });
                    const orderIds = [];
                    (Object.entries(orders): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, allOrderItemIds).length > 0
                      ) {
                        orderIds.push(orderId);
                      }
                    });
                    const targetOrder = orders[state.connectOrder.orderId];
                    const processBatchIds = [];
                    const updateOrdersInput = [];
                    if (targetOrder) {
                      // add order items and batches to target
                      const moveOrderItems = [];
                      orderItemIds.forEach(orderItemId => {
                        const orderItem = orderItems[orderItemId];
                        if (orderItem) {
                          if (
                            intersection(orderItem.batches, batchIds).length === 0 ||
                            orderItem.batches.length === 0
                          ) {
                            moveOrderItems.push({
                              ...orderItem,
                              ...(needToResetPrice
                                ? {
                                    price: {
                                      currency: currencies[0],
                                      amount: 0,
                                    },
                                  }
                                : {}),
                              batches: [],
                              isNew: true,
                            });
                          } else {
                            moveOrderItems.push({
                              ...orderItem,
                              ...(needToResetPrice
                                ? {
                                    price: {
                                      currency: currencies[0],
                                      amount: 0,
                                    },
                                  }
                                : {}),
                              batches: orderItem.batches
                                .filter(batchId => batchIds.includes(batchId))
                                .map(batchId => {
                                  const { totalAdjusted, ...inputBatchFields } = batches[batchId];
                                  return { isNew: true, ...inputBatchFields };
                                }),
                              isNew: true,
                            });
                            processBatchIds.push(...orderItem.batches);
                          }
                        }
                      });
                      // create each order item for the batch without the parent
                      batchIds.forEach(batchId => {
                        if (!processBatchIds.includes(batchId)) {
                          const batch = batches[batchId];
                          processBatchIds.push(batchId);
                          if (batch) {
                            const [, orderItem] = (Object.entries(orderItems): any).find(
                              ([, { batches: currentBatches }]) => {
                                return currentBatches.includes(batch.id);
                              }
                            );
                            const { totalAdjusted, ...inputBatchFields } = batch;
                            moveOrderItems.push({
                              ...orderItem,
                              isNew: true,
                              ...(needToResetPrice
                                ? {
                                    price: {
                                      currency: currencies[0],
                                      amount: 0,
                                    },
                                  }
                                : {}),
                              batches: [{ ...inputBatchFields, isNew: true }],
                            });
                          }
                        }
                      });

                      updateOrdersInput.push({
                        id: targetOrder.id,
                        orderItems: [
                          ...targetOrder.orderItems.map(orderItemId => {
                            const orderItem = orderItems[orderItemId];
                            return {
                              ...orderItem,
                              batches: orderItem.batches.map(batchId => {
                                const { totalAdjusted, ...inputBatchFields } = batches[batchId];
                                return { isNew: false, ...inputBatchFields };
                              }),
                              isNew: false,
                            };
                          }),
                          ...moveOrderItems,
                        ],
                      });

                      // remove order item and batches from original order
                      orderIds.forEach(orderId => {
                        const { orderItems: currentOrderItems } = orders[orderId];
                        updateOrdersInput.push({
                          id: orderId,
                          orderItems: currentOrderItems
                            .filter(orderItemId => !orderItemIds.includes(orderItemId))
                            .map(orderItemId => {
                              const orderItem = orderItems[orderItemId];
                              return {
                                ...orderItem,
                                ...(needToResetPrice
                                  ? {
                                      price: {
                                        currency: currencies[0],
                                        amount: 0,
                                      },
                                    }
                                  : {}),
                                batches: orderItem.batches
                                  .filter(batchId => !batchIds.includes(batchId))
                                  .map(batchId => ({ id: batchId, isNew: false })),
                              };
                            }),
                        });
                      });

                      console.warn({
                        targetOrder,
                        updateOrdersInput,
                        processBatchIds,
                        orderIds,
                      });
                      actions.moveToOrder();
                      try {
                        const updateOrders = await Promise.all(
                          updateOrdersInput.map(item =>
                            client.mutate({
                              mutation: updateOrderMutation,
                              variables: {
                                id: item.id,
                                input: prepareUpdateOrderInput({
                                  orderItems: cleanUpData(item.orderItems),
                                }),
                              },
                            })
                          )
                        );
                        actions.moveToOrderSuccess(updateOrders);
                      } catch (error) {
                        actions.moveToOrderFailed(error);
                      }
                    }
                  }}
                  onClearSelectOrder={() => actions.toggleSelectedOrder('')}
                  onDelete={console.warn}
                />
              )}
              {activeAction === 'split' && uiSelectors.isAllowToSplitBatch() && (
                <SplitPanel
                  max={getByPathWithDefault(
                    0,
                    `${uiSelectors.targetedBatchId()}.quantity`,
                    batches
                  )}
                  onSplit={async inputData => {
                    const { type, quantity } = inputData;
                    const id = uiSelectors.targetedBatchId();
                    try {
                      actions.splitBatch({
                        type,
                        quantity,
                        batchId: id,
                      });
                      const [, orderId] = (
                        state.split.parentOrderIds.find(item => item.includes(`${id}-`)) || ''
                      ).split('-');
                      if (type === 'batchEqualSplit') {
                        const result: any = await client.mutate({
                          mutation: batchEqualSplitMutation,
                          variables: { id, input: { precision: 0, divideBy: quantity } },
                          refetchQueries: [
                            {
                              query: orderDetailQuery,
                              variables: {
                                id: orderId,
                              },
                            },
                          ],
                        });
                        if (result.data.batchEqualSplit.batches) {
                          actions.splitBatchSuccess(id, result.data.batchEqualSplit);
                        } else {
                          actions.splitBatchFailed(result.data.batchEqualSplit.violations);
                          toast.error(result.data.batchEqualSplit.violations[0].message);
                        }
                      } else {
                        const result: any = await client.mutate({
                          mutation: batchSimpleSplitMutation,
                          variables: { id, input: { quantity } },
                          refetchQueries: [
                            {
                              query: orderDetailQuery,
                              variables: {
                                id: orderId,
                              },
                            },
                          ],
                        });
                        if (result.data.batchSimpleSplit.batches) {
                          actions.splitBatchSuccess(id, result.data.batchSimpleSplit);
                        } else {
                          actions.splitBatchFailed(result.data.batchSimpleSplit.violations);
                          toast.error(result.data.batchSimpleSplit.violations[0].message);
                        }
                      }
                    } catch (error) {
                      actions.splitBatchFailed(error);
                    }
                  }}
                />
              )}
            </>
          )}
          {uiSelectors.isHighLightAnyItem() && (
            <HighLightToolBar
              totalOrder={uiSelectors.countHighLightBy(highLightEntities, ORDER)}
              totalOrderItem={uiSelectors.countHighLightBy(highLightEntities, ORDER_ITEM)}
              totalBatch={uiSelectors.countHighLightBy(highLightEntities, BATCH)}
              totalShipment={uiSelectors.countHighLightBy(highLightEntities, SHIPMENT)}
              onCancel={() => actions.clearAllBy('HIGHLIGHT')}
            />
          )}
        </>
      )}
    </ApolloConsumer>
  );
}
