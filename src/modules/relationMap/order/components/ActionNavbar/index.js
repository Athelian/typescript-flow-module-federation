// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { intersection } from 'lodash';
import { BooleanValue } from 'react-values';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import usePermission from 'hooks/usePermission';
import { ORDER_CREATE, ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import logger from 'utils/logger';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import SlideView from 'components/SlideView';
import { BaseButton } from 'components/Buttons';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors, actionCreators } from 'modules/relationMap/order/store';
import { orderDetailQuery, shipmentDetailQuery } from 'modules/relationMap/order/query';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'constants/keywords';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import messages from 'modules/relationMap/messages';
import { prepareParsedOrderInput } from 'modules/order/form/mutation';
import { TabItemStyled, LoadingContainerStyle, MoveToWrapper } from './style';
import TargetToolBar from './TargetToolBar';
import HighLightToolBar from './HighLightToolBar';
import ClonePanel from './ClonePanel';
import SplitPanel from './SplitPanel';
import SplitBalancePanel from './SplitBalancePanel';
import ConstraintPanel from './ConstraintPanel';
import MoveToOrderPanel from './MoveToOrderPanel';
import MoveToShipmentPanel from './MoveToShipmentPanel';
import ErrorPanel from './ErrorPanel';
import { batchBalanceSplitMutation } from './SplitBalancePanel/mutation';
import { batchEqualSplitMutation, batchSimpleSplitMutation } from './SplitPanel/mutation';
import {
  cloneOrderMutation,
  cloneBatchMutation,
  cloneShipmentMutation,
  cloneOrderItemMutation,
} from './ClonePanel/mutation';
import { updateOrderMutation } from './MoveToOrderPanel/mutation';
import { updateBatchMutation } from './MoveToShipmentPanel/mutation';
import { prepareOrderInput } from './helper';
import TableView from '../TableInlineEdit';
import RMEditTasks from '../RMEditTasks';

type Props = {
  highLightEntities: Array<string>,
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    shipments: Object,
    exporters: Object,
  },
};

export default function ActionNavbar({ highLightEntities, entities }: Props) {
  const { orders, orderItems, batches, shipments, exporters } = entities;
  const { hasPermission } = usePermission();
  const [activeAction, setActiveAction] = React.useState('clone');
  const context = React.useContext(ActionDispatch);
  const { state, dispatch } = context;
  const uiSelectors = selectors(state);
  const actions = actionCreators(dispatch);
  return (
    <ApolloConsumer>
      {client => (
        <>
          {uiSelectors.isHighLightAnyItem() && (
            <HighLightToolBar
              totalOrder={uiSelectors.countHighLightBy(highLightEntities, ORDER)}
              totalOrderItem={uiSelectors.countHighLightBy(highLightEntities, ORDER_ITEM)}
              totalBatch={uiSelectors.countHighLightBy(highLightEntities, BATCH)}
              totalShipment={uiSelectors.countHighLightBy(highLightEntities, SHIPMENT)}
              onCancel={() => actions.clearAllBy('HIGHLIGHT')}
            />
          )}
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
                  disabled={uiSelectors.isDisableCloneOrder(!hasPermission(ORDER_CREATE))}
                  label={
                    <FormattedMessage
                      id="modules.RelationMaps.label.clone"
                      defaultMessage="CLONE"
                    />
                  }
                  icon="CLONE"
                  active={activeAction === 'clone'}
                  onClick={() => {
                    actions.changeSelectMode('');
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
                    actions.changeSelectMode('');
                    setActiveAction('split');
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
                    actions.changeSelectMode('');
                    setActiveAction('autoFillBatch');
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
                    actions.changeSelectMode('ORDER');
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
                    actions.changeSelectMode('SHIPMENT');
                    setActiveAction('connectShipment');
                  }}
                />

                <BooleanValue>
                  {({ value: isOpen, set: toggleTaskList }) => (
                    <>
                      <BaseButton
                        icon="TASK"
                        label={
                          <FormattedMessage
                            id="module.RelationMaps.label.task"
                            defaultMessage="TASK"
                          />
                        }
                        backgroundColor="TEAL"
                        hoverBackgroundColor="TEAL_DARK"
                        onClick={() => toggleTaskList(true)}
                      />
                      <SlideView isOpen={isOpen} onRequestClose={() => toggleTaskList(false)}>
                        {isOpen && <RMEditTasks />}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>

                <BooleanValue>
                  {({ value: opened, set: openTableView }) => (
                    <>
                      <BaseButton
                        icon="EDIT_TABLE"
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
                      <SlideView isOpen={opened} onRequestClose={() => openTableView(false)}>
                        {opened && (
                          <TableView entities={entities} onCancel={() => openTableView(false)} />
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              </TargetToolBar>
              {['clone', 'split', 'autoFillBatch', 'connectOrder', 'connectShipment'].includes(
                activeAction
              ) && (
                <ConstraintPanel
                  disable={{
                    disabledSplit: activeAction === 'split' && !uiSelectors.isAllowToSplitBatch(),
                    disableAutoFillBatch:
                      activeAction === 'autoFillBatch' && !uiSelectors.isAllowToAutoFillBatch(),
                    disabledMoveToShipment:
                      activeAction === 'connectShipment' && !uiSelectors.isAllowToConnectShipment(),
                    disabledMoveToOrder:
                      activeAction === 'connectOrder' && !uiSelectors.isAllowToConnectOrder(),
                    disabledCloneOrder:
                      activeAction === 'clone' &&
                      uiSelectors.isDisableCloneOrder(!hasPermission(RM_CLONE_ORDER)),
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
              {activeAction === 'clone' &&
                !uiSelectors.isDisableCloneOrder(!hasPermission(RM_CLONE_ORDER)) && (
                  <ClonePanel
                    onClick={async () => {
                      const batchIds = uiSelectors.targetedBatchIds();
                      const shipmentIds = uiSelectors.targetedShipmentIds();
                      const orderItemIds = uiSelectors.targetedOrderItemIds();
                      const allOrderItemIds = [...orderItemIds];
                      (Object.entries(orderItems || {}): Array<any>).forEach(
                        ([orderItemId, orderItem]) => {
                          if (
                            !allOrderItemIds.includes(orderItemId) &&
                            intersection(orderItem.batches, batchIds).length > 0
                          ) {
                            allOrderItemIds.push(orderItemId);
                          }
                        }
                      );
                      const orderIds = uiSelectors.targetedOrderIds();
                      const allOrderIds = [...orderIds];
                      (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
                        if (
                          !allOrderIds.includes(orderId) &&
                          intersection(order.orderItems, allOrderItemIds).length > 0
                        ) {
                          allOrderIds.push(orderId);
                        }
                      });
                      actions.cloneEntities([
                        {
                          type: ORDER,
                          ids: orderIds,
                        },
                        {
                          type: ORDER_ITEM,
                          ids: orderItemIds,
                        },
                        {
                          type: BATCH,
                          ids: batchIds,
                        },
                        {
                          type: SHIPMENT,
                          ids: shipmentIds,
                        },
                      ]);

                      const processBatchIds = [];
                      const processOrderItemIds = [];
                      try {
                        const result = [];
                        if (orderIds.length > 0) {
                          const cloneOrders = await Promise.all(
                            orderIds.map(orderId => {
                              const selectedOrderItemIds = intersection(
                                orders[orderId].orderItems,
                                orderItemIds
                              );
                              if (selectedOrderItemIds.length > 0) {
                                processOrderItemIds.push(...selectedOrderItemIds);
                              }
                              return client.mutate({
                                mutation: cloneOrderMutation,
                                variables: {
                                  id: orderId,
                                  input: {
                                    poNo: `[cloned] ${orders[orderId].poNo}`,
                                    orderItems: selectedOrderItemIds.map(orderItemId => {
                                      const selectedBatchIds = intersection(
                                        orderItems[orderItemId]
                                          ? orderItems[orderItemId].batches
                                          : [],
                                        batchIds
                                      );
                                      if (selectedBatchIds.length > 0) {
                                        processBatchIds.push(...selectedBatchIds);
                                      }
                                      return {
                                        id: orderItemId,
                                        batches: selectedBatchIds.map(id => ({ id })),
                                      };
                                    }),
                                  },
                                },
                              });
                            })
                          );
                          // TODO: show error message from violations
                          result.push({
                            type: ORDER,
                            items: cloneOrders
                              .map((item, index) => ({
                                id: orderIds[index],
                                order: getByPathWithDefault([], 'data.orderClone', item),
                              }))
                              .filter(item => !item.order.violations),
                          });
                        }

                        if (orderItemIds.length > 0) {
                          const cloneOrderItems = await Promise.all(
                            orderItemIds
                              .filter(orderItemId => !processOrderItemIds.includes(orderItemId))
                              .map(orderItemId => {
                                const selectedBatchIds = intersection(
                                  orderItems[orderItemId] ? orderItems[orderItemId].batches : [],
                                  batchIds
                                );
                                if (selectedBatchIds.length > 0) {
                                  processBatchIds.push(...selectedBatchIds);
                                }
                                return client.mutate({
                                  mutation: cloneOrderItemMutation,
                                  variables: {
                                    id: orderItemId,
                                    input: {
                                      batches: selectedBatchIds.map(id => ({ id })),
                                    },
                                  },
                                  refetchQueries: allOrderIds.map(orderId => ({
                                    query: orderDetailQuery,
                                    variables: {
                                      id: orderId,
                                    },
                                  })),
                                });
                              })
                          );
                          // TODO: show error message from violations
                          result.push({
                            type: ORDER_ITEM,
                            items: cloneOrderItems
                              .map((item, index) => ({
                                id: orderItemIds[index],
                                orderItem: getByPathWithDefault([], 'data.orderItemClone', item),
                              }))
                              .filter(item => !item.orderItem.violations),
                          });
                        }

                        if (batchIds.length > 0) {
                          const cloneBatches = await Promise.all(
                            batchIds
                              .filter(batchId => !processBatchIds.includes(batchId))
                              .map(batchId =>
                                client.mutate({
                                  mutation: cloneBatchMutation,
                                  variables: {
                                    id: batchId,
                                    input: {
                                      deliveredAt: null,
                                      desiredAt: null,
                                      expiredAt: null,
                                      customFields: null,
                                      producedAt: null,
                                      tagIds: [],
                                      batchQuantityRevisions: [],
                                    },
                                  },
                                  refetchQueries: allOrderIds.map(orderId => ({
                                    query: orderDetailQuery,
                                    variables: {
                                      id: orderId,
                                    },
                                  })),
                                })
                              )
                          );
                          // TODO: show error message from violations
                          result.push({
                            type: BATCH,
                            items: cloneBatches
                              .map((item, index) => ({
                                id: batchIds[index],
                                batch: getByPathWithDefault([], 'data.batchClone', item),
                              }))
                              .filter(item => !item.batch.violations),
                          });
                        }

                        if (shipmentIds.length > 0) {
                          const cloneShipments: any = await Promise.all(
                            shipmentIds.map(shipmentId =>
                              client.mutate({
                                mutation: cloneShipmentMutation,
                                variables: {
                                  id: shipmentId,
                                  input: {
                                    batches: [],
                                    containers: [],
                                    no: `[cloned][${Date.now()}] ${uiSelectors.shipmentNo(
                                      shipmentId
                                    )}`,
                                  },
                                },
                              })
                            )
                          );
                          const shipmentItems = cloneShipments
                            .map((item, index) => ({
                              id: shipmentIds[index],
                              shipment: getByPathWithDefault([], 'data.shipmentClone', item),
                            }))
                            .filter(item => !item.shipment.violations);

                          const refetchShipment = shipmentItems[shipmentItems.length - 1];
                          if (refetchShipment) {
                            actions.refetchQueryBy('SHIPMENT', [refetchShipment.shipment.id]);
                          }

                          cloneShipments.forEach(item => {
                            if (item.data.shipmentClone && item.data.shipmentClone.violations) {
                              toast.error(
                                `[Clone] error: ${item.data.shipmentClone.violations[0].message}`
                              );
                            }
                          });

                          result.push({
                            type: SHIPMENT,
                            items: shipmentItems,
                          });
                        }
                        actions.cloneEntitiesSuccess(result);
                        if (orderIds.length) {
                          actions.setRefetchAll(true);
                        }
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
                    (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
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
              {activeAction === 'connectShipment' && uiSelectors.isAllowToConnectShipment() && (
                <MoveToShipmentPanel
                  status={state.connectShipment.status}
                  hasSelectedShipment={uiSelectors.isSelectedShipment()}
                  onClear={actions.clearConnectMessage}
                  onClearSelectShipment={() => actions.toggleSelectedShipment('')}
                  onDisconnect={async () => {
                    const batchIds = uiSelectors.targetedBatchIds();
                    const allOrderItemIds = [];
                    (Object.entries(orderItems || {}): Array<any>).forEach(
                      ([orderItemId, orderItem]) => {
                        if (
                          !allOrderItemIds.includes(orderItemId) &&
                          intersection(orderItem.batches, batchIds).length > 0
                        ) {
                          allOrderItemIds.push(orderItemId);
                        }
                      }
                    );
                    const orderIds = [];
                    (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, allOrderItemIds).length > 0
                      ) {
                        orderIds.push(orderId);
                      }
                    });
                    const shipmentId = null;
                    actions.disconnectShipment(batchIds);
                    try {
                      const updateBatches = await Promise.all(
                        batchIds.map((id, idx) =>
                          client.mutate({
                            mutation: updateBatchMutation,
                            variables: {
                              id,
                              input: {
                                shipmentId,
                              },
                            },
                            ...(idx === batchIds.length - 1
                              ? {
                                  refetchQueries: orderIds.map(orderId => ({
                                    query: orderDetailQuery,
                                    variables: {
                                      id: orderId,
                                    },
                                  })),
                                }
                              : {}),
                          })
                        )
                      );
                      actions.disconnectShipmentSuccess(
                        updateBatches.map(result => (result.data ? result.data.BatchUpdate : {}))
                      );
                    } catch (error) {
                      actions.disconnectShipmentFailed(error);
                    }
                  }}
                  onMoveToExistShipment={async () => {
                    const batchIds = uiSelectors.targetedBatchIds();
                    const allOrderItemIds = [];
                    const shipmentIds = [];
                    batchIds.forEach(batchId => {
                      const batch = batches[batchId];
                      if (batch && batch.shipment) {
                        shipmentIds.push(batch.shipment.id);
                      }
                    });

                    (Object.entries(orderItems || {}): Array<any>).forEach(
                      ([orderItemId, orderItem]) => {
                        if (
                          !allOrderItemIds.includes(orderItemId) &&
                          intersection(orderItem.batches, batchIds).length > 0
                        ) {
                          allOrderItemIds.push(orderItemId);
                        }
                      }
                    );

                    const orderIds = [];
                    (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, allOrderItemIds).length > 0
                      ) {
                        orderIds.push(orderId);
                      }
                    });
                    const { shipmentId } = state.connectShipment;
                    actions.moveToShipment(batchIds, shipmentIds);
                    try {
                      const updateBatches = await Promise.all(
                        batchIds.map((id, idx) =>
                          client.mutate({
                            mutation: updateBatchMutation,
                            variables: {
                              id,
                              input: {
                                shipmentId,
                                containerId: null,
                              },
                            },
                            ...(idx === batchIds.length - 1
                              ? {
                                  refetchQueries: [
                                    ...orderIds.map(entityId => ({
                                      query: orderDetailQuery,
                                      variables: {
                                        id: entityId,
                                      },
                                    })),
                                    ...shipmentIds.map(entityId => ({
                                      query: shipmentDetailQuery,
                                      variables: {
                                        id: entityId,
                                      },
                                    })),
                                  ],
                                }
                              : {}),
                          })
                        )
                      );
                      actions.moveToShipmentSuccess(
                        updateBatches.map(result => (result.data ? result.data.BatchUpdate : {}))
                      );
                    } catch (error) {
                      actions.moveToShipmentFailed(error);
                    }
                  }}
                  onMoveToNewShipment={() => {
                    const defaultBatchInput = {
                      batchQuantityRevisions: [],
                      todo: {
                        tasks: [],
                      },
                    };
                    const batchIds = uiSelectors.targetedBatchIds();
                    const shipmentIds = [];
                    batchIds.forEach(batchId => {
                      const batch = batches[batchId];
                      if (batch && batch.shipment) {
                        shipmentIds.push(batch.shipment.id);
                      }
                    });
                    const initBatches = batchIds
                      .map(batchId => {
                        const [orderItemId, orderItem] =
                          (Object.entries(orderItems || {}): Array<any>).find(
                            ([, item]) => item.batches && item.batches.includes(batchId)
                          ) || [];
                        const [, order] =
                          (Object.entries(orders || {}): Array<any>).find(
                            ([, item]) => item.orderItems && item.orderItems.includes(orderItemId)
                          ) || [];

                        if (!batches[batchId]) {
                          return false;
                        }
                        const batch = batches[batchId];
                        return {
                          ...defaultBatchInput,
                          ...batch,
                          quantity: batch.latestQuantity || 0,
                          shipment: null,
                          container: null,
                          orderItem: {
                            ...orderItem,
                            productProvider: {
                              ...orderItem.productProvider,
                              exporter: exporters[orderItem.productProvider.exporter],
                            },
                            order: {
                              ...order,
                              exporter: exporters[order.exporter],
                            },
                          },
                        };
                      })
                      .filter(Boolean);
                    actions.showEditForm('NEW_SHIPMENT', 'new', { batches: initBatches });
                    actions.moveToNewShipment(batchIds, shipmentIds);
                  }}
                />
              )}
              {activeAction === 'connectOrder' && uiSelectors.isAllowToConnectOrder() && (
                <MoveToOrderPanel
                  allowToMoveToNew={
                    hasPermission(ORDER_CREATE) &&
                    hasPermission(ORDER_ITEMS_CREATE) &&
                    hasPermission(ORDER_FORM)
                  }
                  status={state.connectOrder.status}
                  hasSelectedOrderItem={uiSelectors.targetedOrderItemIds().length > 0}
                  hasSelectedOrder={uiSelectors.isSelectedOrder()}
                  hasSelectedAllBatches={uiSelectors.hasSelectedAllBatches(orderItems)}
                  currencies={uiSelectors.findAllCurrencies(orders, orderItems)}
                  onClear={actions.clearConnectMessage}
                  onMoveToNewOrder={() => {
                    const currencies = [];
                    const needToResetPrice = currencies.length > 1;
                    const orderItemIds = uiSelectors.targetedOrderItemIds();
                    const batchIds = uiSelectors.targetedBatchIds();
                    const allOrderItemIds = [...orderItemIds];
                    (Object.entries(orderItems || {}): Array<any>).forEach(
                      ([orderItemId, orderItem]) => {
                        if (
                          !allOrderItemIds.includes(orderItemId) &&
                          intersection(orderItem.batches, batchIds).length > 0
                        ) {
                          allOrderItemIds.push(orderItemId);
                        }
                      }
                    );
                    allOrderItemIds.forEach(orderItemId => {
                      if (orderItems[orderItemId]) {
                        const { price } = orderItems[orderItemId];
                        if (!currencies.includes(price.currency)) currencies.push(price.currency);
                      }
                    });
                    const processBatchIds = [];
                    const moveOrderItems = [];
                    const defaultInput = {
                      todo: {
                        tasks: [],
                      },
                      files: [],
                    };
                    orderItemIds.forEach(orderItemId => {
                      const orderItem = orderItems[orderItemId];
                      if (orderItem) {
                        if (
                          intersection(orderItem.batches, batchIds).length === 0 ||
                          orderItem.batches.length === 0
                        ) {
                          moveOrderItems.push({
                            ...defaultInput,
                            ...orderItem,
                            ...(needToResetPrice
                              ? {
                                  price: {
                                    currency: currencies.length > 0 ? currencies[0] : 'USD',
                                    amount: 0,
                                  },
                                }
                              : {}),
                            batches: [],
                          });
                        } else {
                          moveOrderItems.push({
                            ...defaultInput,
                            ...orderItem,
                            ...(needToResetPrice
                              ? {
                                  price: {
                                    currency: currencies.length > 0 ? currencies[0] : 'USD',
                                    amount: 0,
                                  },
                                }
                              : {}),
                            batches: orderItem.batches
                              .filter(batchId => batchIds.includes(batchId))
                              .map(batchId => {
                                const { ...inputBatchFields } = batches[batchId];
                                return {
                                  ...defaultInput,
                                  ...inputBatchFields,
                                  quantity: inputBatchFields.latestQuantity || 0,
                                  batchQuantityRevisions: [],
                                  shipment: inputBatchFields.shipment
                                    ? shipments[inputBatchFields.shipment.id]
                                    : null,
                                };
                              }),
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
                            ([, { batches: currentBatches = [] }]) => {
                              return currentBatches.includes(batch.id);
                            }
                          );
                          moveOrderItems.push({
                            ...defaultInput,
                            ...orderItem,
                            ...(needToResetPrice
                              ? {
                                  price: {
                                    currency: currencies.length > 0 ? currencies[0] : 'USD',
                                    amount: 0,
                                  },
                                }
                              : {}),
                            batches: [
                              {
                                ...defaultInput,
                                ...batch,
                                shipment: batch.shipment ? shipments[batch.shipment.id] : null,
                                quantity: batch.latestQuantity || 0,
                                batchQuantityRevisions: [],
                              },
                            ],
                            quantity: batch.latestQuantity || 0,
                          });
                        }
                      }
                    });
                    actions.showEditForm('NEW_ORDER', 'new', {
                      exporter: exporters[uiSelectors.currentExporterId()],
                      currency: currencies.length === 1 ? currencies[0] : 'USD',
                      orderItems: moveOrderItems,
                    });
                    // remove order item and batches from original order
                    const orderIds = [];
                    (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, allOrderItemIds).length > 0
                      ) {
                        orderIds.push(orderId);
                      }
                    });
                    const updateOrdersInput = [];
                    orderIds.forEach(orderId => {
                      const { orderItems: oldOrderItems, currency } = orders[orderId];
                      updateOrdersInput.push({
                        id: orderId,
                        oldCurrency: currency,
                        newCurrency: currency,
                        oldOrderItems: oldOrderItems.map(orderItemId => {
                          const orderItem = orderItems[orderItemId];
                          return {
                            ...orderItem,
                            batches: orderItem.batches.map(batchId => ({
                              id: batchId,
                              isNew: false,
                            })),
                          };
                        }),
                        orderItems: oldOrderItems
                          .filter(
                            orderItemId =>
                              orderItemIds &&
                              Array.isArray(orderItemIds) &&
                              !orderItemIds.includes(orderItemId)
                          )
                          .map(orderItemId => {
                            const orderItem = orderItems[orderItemId];
                            return {
                              ...orderItem,
                              batches: orderItem.batches
                                .filter(
                                  batchId =>
                                    batchIds &&
                                    Array.isArray(batchIds) &&
                                    !batchIds.includes(batchId)
                                )
                                .map(batchId => ({ id: batchId, isNew: false })),
                            };
                          }),
                      });
                    });
                    actions.prepareRemoveOrderItemsAndBatches(updateOrdersInput);
                  }}
                  onMoveToExistOrder={async ({ currencies }) => {
                    const needToResetPrice = currencies.length > 1;
                    const targetOrder = orders[state.connectOrder.orderId];
                    if (!targetOrder) {
                      logger.error('Not found order');
                      return;
                    }
                    const ignoreOrderItemIds = targetOrder.orderItems;
                    const ignoreBatchIds = ignoreOrderItemIds.reduce((result, orderItemId) => {
                      const { batches: batchesOfOrderItem = [] } = orderItems[orderItemId];
                      return result.concat(batchesOfOrderItem);
                    }, []);
                    const orderItemIds = uiSelectors
                      .targetedOrderItemIds()
                      .filter(orderItemId => !ignoreOrderItemIds.includes(orderItemId));
                    const batchIds = uiSelectors
                      .targetedBatchIds()
                      .filter(batchId => !ignoreBatchIds.includes(batchId));
                    const allOrderItemIds = [...orderItemIds];
                    (Object.entries(orderItems || {}): Array<any>).forEach(
                      ([orderItemId, orderItem]) => {
                        if (
                          !targetOrder.orderItems.includes(orderItemId) &&
                          !allOrderItemIds.includes(orderItemId) &&
                          intersection(orderItem.batches, batchIds).length > 0
                        ) {
                          allOrderItemIds.push(orderItemId);
                        }
                      }
                    );
                    const orderIds = [];
                    (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, allOrderItemIds).length > 0
                      ) {
                        orderIds.push(orderId);
                      }
                    });
                    const processBatchIds = [];
                    const updateOrdersInput: Array<{
                      id: string,
                      newCurrency: string,
                      oldCurrency: string,
                      oldOrderItems: Array<Object>,
                      orderItems: Array<Object>,
                    }> = [];
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
                                    currency: currencies.length > 0 ? currencies[0] : 'USD',
                                    amount: 0,
                                  },
                                }
                              : {}),
                            batches: [],
                          });
                        } else {
                          moveOrderItems.push({
                            ...orderItem,
                            ...(needToResetPrice
                              ? {
                                  price: {
                                    currency: currencies.length > 0 ? currencies[0] : 'USD',
                                    amount: 0,
                                  },
                                }
                              : {}),
                            batches: orderItem.batches
                              .filter(batchId => batchIds.includes(batchId))
                              .map(batchId => ({
                                ...batches[batchId],
                                quantity: batches[batchId].latestQuantity || 0,
                                batchQuantityRevisions: [],
                              })),
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
                            ([, { batches: currentBatches = [] }]) => {
                              return currentBatches.includes(batch.id);
                            }
                          );
                          moveOrderItems.push({
                            ...orderItem,
                            ...(needToResetPrice
                              ? {
                                  price: {
                                    currency: currencies.length > 0 ? currencies[0] : 'USD',
                                    amount: 0,
                                  },
                                }
                              : {}),
                            batches: [
                              {
                                ...batch,
                                quantity: batch.latestQuantity || 0,
                                batchQuantityRevisions: [],
                              },
                            ],
                            quantity: batch.latestQuantity || 0,
                          });
                        }
                      }
                    });

                    const oldOrderItems = targetOrder.orderItems.map(orderItemId => {
                      const orderItem = orderItems[orderItemId];
                      return {
                        ...orderItem,
                        batches: orderItem.batches.map(batchId => batches[batchId]),
                      };
                    });
                    updateOrdersInput.push({
                      id: targetOrder.id,
                      oldCurrency: targetOrder.currency,
                      newCurrency: currencies.length > 0 ? currencies[0] : 'USD',
                      oldOrderItems,
                      orderItems: [...oldOrderItems, ...moveOrderItems],
                    });

                    // remove order item and batches from original order
                    orderIds.forEach(orderId => {
                      const { orderItems: existOrderItems, currency } = orders[orderId];
                      updateOrdersInput.push({
                        id: orderId,
                        oldCurrency: currency,
                        newCurrency: currency,
                        oldOrderItems: existOrderItems.map(orderItemId => {
                          const orderItem = orderItems[orderItemId];
                          return {
                            ...orderItem,
                            batches: orderItem.batches.map(batchId => ({
                              ...batches[batchId],
                              quantity: batches[batchId].latestQuantity || 0,
                              batchQuantityRevisions: [],
                            })),
                          };
                        }),
                        orderItems: existOrderItems
                          .filter(orderItemId => !orderItemIds.includes(orderItemId))
                          .map(orderItemId => {
                            const orderItem = orderItems[orderItemId];
                            return {
                              ...orderItem,
                              ...(needToResetPrice
                                ? {
                                    price: {
                                      currency: currencies.length > 0 ? currencies[0] : 'USD',
                                      amount: 0,
                                    },
                                  }
                                : {}),
                              batches: orderItem.batches
                                .filter(batchId => !batchIds.includes(batchId))
                                .map(batchId => ({
                                  ...batches[batchId],
                                  quantity: batches[batchId].latestQuantity || 0,
                                  batchQuantityRevisions: [],
                                })),
                            };
                          }),
                      });
                    });

                    actions.moveToOrder({
                      ...targetOrder,
                      orderItems: targetOrder.orderItems.map(
                        orderItemId => orderItems[orderItemId]
                      ),
                    });
                    try {
                      const updateOrders = await Promise.all(
                        updateOrdersInput.map(item =>
                          client.mutate({
                            mutation: updateOrderMutation,
                            variables: {
                              id: item.id,
                              input: prepareOrderInput(
                                {
                                  currency: item.oldCurrency,
                                  orderItems: item.oldOrderItems,
                                },
                                {
                                  currency: item.newCurrency,
                                  orderItems: item.orderItems,
                                }
                              ),
                            },
                          })
                        )
                      );
                      actions.moveToOrderSuccess(
                        updateOrders.map(result => (result.data ? result.data.orderUpdate : {}))
                      );
                    } catch (error) {
                      actions.moveToOrderFailed(error);
                    }
                  }}
                  onClearSelectOrder={() => actions.toggleSelectedOrder('')}
                  onDelete={async (currencies: Array<string>) => {
                    const orderItemIds = uiSelectors.targetedOrderItemIds();
                    const batchIds = uiSelectors.targetedBatchIds();
                    const allOrderItemIds = [...orderItemIds];
                    (Object.entries(orderItems || {}): Array<any>).forEach(
                      ([orderItemId, orderItem]) => {
                        if (
                          !allOrderItemIds.includes(orderItemId) &&
                          intersection(orderItem.batches, batchIds).length > 0
                        ) {
                          allOrderItemIds.push(orderItemId);
                        }
                      }
                    );
                    const orderIds = [];
                    (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, allOrderItemIds).length > 0
                      ) {
                        orderIds.push(orderId);
                      }
                    });

                    // remove order item and batches from original order
                    const updateOrdersInput: Array<{
                      id: string,
                      oldOrderItems: Array<Object>,
                      orderItems: Array<Object>,
                    }> = [];
                    orderIds.forEach(orderId => {
                      const { orderItems: oldOrderItems } = orders[orderId];
                      updateOrdersInput.push({
                        id: orderId,
                        oldOrderItems,
                        orderItems: oldOrderItems
                          .filter(orderItemId => !orderItemIds.includes(orderItemId))
                          .map(orderItemId => {
                            const orderItem = orderItems[orderItemId];
                            return {
                              ...orderItem,
                              batches: orderItem.batches
                                .filter(batchId => !batchIds.includes(batchId))
                                .map(batchId => ({ id: batchId, isNew: false })),
                            };
                          }),
                      });
                    });

                    try {
                      await Promise.all(
                        updateOrdersInput.map(item =>
                          client.mutate({
                            mutation: updateOrderMutation,
                            variables: {
                              id: item.id,
                              input: prepareParsedOrderInput(
                                {
                                  tags: [],
                                  inCharges: [],
                                  files: [],
                                  todo: {
                                    tasks: [],
                                  },
                                  currency: currencies.length > 0 ? currencies[0] : 'USD',
                                  orderItems: item.oldOrderItems,
                                },
                                {
                                  tags: [],
                                  inCharges: [],
                                  files: [],
                                  todo: {
                                    tasks: [],
                                  },
                                  currency: currencies.length > 0 ? currencies[0] : 'USD',
                                  orderItems: item.orderItems,
                                }
                              ),
                            },
                          })
                        )
                      );
                      actions.removeEntitiesSuccess();
                    } catch (error) {
                      actions.removeEntitiesFailed(error);
                    }
                  }}
                />
              )}
              {activeAction === 'split' && uiSelectors.isAllowToSplitBatch() && (
                <SplitPanel
                  max={getByPathWithDefault(
                    0,
                    `${uiSelectors.targetedBatchId()}.latestQuantity`,
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
                      const batchIds = [id];
                      const allOrderItemIds = [];
                      (Object.entries(orderItems || {}): Array<any>).forEach(
                        ([orderItemId, orderItem]) => {
                          if (
                            !allOrderItemIds.includes(orderItemId) &&
                            intersection(orderItem.batches, batchIds).length > 0
                          ) {
                            allOrderItemIds.push(orderItemId);
                          }
                        }
                      );
                      const orderIds = [];
                      (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
                        if (
                          !orderIds.includes(orderId) &&
                          intersection(order.orderItems, allOrderItemIds).length > 0
                        ) {
                          orderIds.push(orderId);
                        }
                      });
                      const [orderId] = orderIds;
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
        </>
      )}
    </ApolloConsumer>
  );
}
