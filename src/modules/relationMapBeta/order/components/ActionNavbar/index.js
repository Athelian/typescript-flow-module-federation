// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { intersection } from 'lodash';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
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

type Props = {
  highLightEntities: Array<string>,
  batches: Object,
  orders: Object,
  orderItems: Object,
};

export default function ActionNavbar({ highLightEntities, batches, orders, orderItems }: Props) {
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
                  disabled={!uiSelectors.isAllowToConnectOrder(orderItems)}
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
              </TargetToolBar>
              {['split', 'autoFillBatch', 'connectOrder'].includes(activeAction) && (
                <ConstraintPanel
                  disable={{
                    disabledSplit: activeAction === 'split' && !uiSelectors.isAllowToSplitBatch(),
                    disableAutoFillBatch:
                      activeAction === 'autoFillBatch' && !uiSelectors.isAllowToAutoFillBatch(),
                    disabledMoveToShipment: false,
                    disabledMoveToOrder:
                      activeAction === 'connectOrder' &&
                      !uiSelectors.isAllowToConnectOrder(orderItems),
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
                      const result = cloneBatches.map((item, index) => {
                        return {
                          id: batchIds[index],
                          batch: getByPathWithDefault([], 'data.batchClone', item),
                        };
                      });
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
                      const result = balanceSplitBatches.map((item, index) => {
                        return {
                          id: orderItemIds[index],
                          batches: getByPathWithDefault([], 'data.batchBalanceSplit.batches', item),
                        };
                      });
                      actions.autoFillBatchesSuccess(result);
                    } catch (error) {
                      actions.autoFillBatchesFailed(error);
                    }
                  }}
                />
              )}
              {activeAction === 'connectOrder' && uiSelectors.isAllowToConnectOrder(orderItems) && (
                <MoveToOrderPanel
                  onMoveToNewOrder={console.warn}
                  onMoveToExistOrder={console.warn}
                  onClearSelectOrder={console.warn}
                  hasSelectedOrder={false}
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
