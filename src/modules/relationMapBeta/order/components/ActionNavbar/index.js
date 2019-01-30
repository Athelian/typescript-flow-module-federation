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
} from 'modules/relationMap/common/ActionPanel/ActionSubscribe/style';
import messages from 'modules/relationMap/messages';
import TargetToolBar from './TargetToolBar';
import HighLightToolBar from './HighLightToolBar';
import SplitPanel from './SplitPanel';
import SplitBalancePanel from './SplitBalancePanel';
import { batchEqualSplitMutation, batchSimpleSplitMutation } from './SplitPanel/mutation';
import { batchBalanceSplitMutation } from './SplitBalancePanel/mutation';
import ConstraintPanel from './ConstraintPanel';
import ErrorPanel from './ErrorPanel';

type Props = {
  highLightEntities: Array<string>,
  batches: Object,
  orders: Object,
};

export default function ActionNavbar({ highLightEntities, batches, orders }: Props) {
  const [activeAction, setActiveAction] = React.useState('');
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
                      id="modules.RelationMaps.label.split"
                      defaultMessage="SPLIT"
                    />
                  }
                  icon="SPLIT"
                  disabled={!uiSelectors.isAllowToSplitBatch()}
                  active={activeAction === 'split'}
                  onClick={() => setActiveAction('split')}
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
                  onClick={() => setActiveAction('autoFillBatch')}
                />
              </TargetToolBar>
              {['split', 'autoFillBatch'].includes(activeAction) && (
                <ConstraintPanel
                  disable={{
                    disabledSplit: activeAction === 'split' && !uiSelectors.isAllowToSplitBatch(),
                    disableAutoFillBatch:
                      activeAction === 'autoFillBatch' && !uiSelectors.isAllowToAutoFillBatch(),
                    disabledMoveToShipment: false,
                    disabledMoveToOrder: false,
                  }}
                />
              )}
              {state.error && (
                <ErrorPanel onClickCancel={console.warn} onClickRefresh={console.warn} />
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
              {activeAction === 'autoFillBatch' && uiSelectors.isAllowToAutoFillBatch() && (
                <SplitBalancePanel
                  onClick={async () => {
                    const orderItemIds = uiSelectors.targetedOrderItemIds();
                    const orderIds = [];
                    (Object.entries(orders): Array<any>).forEach(([orderId, order]) => {
                      if (
                        !orderIds.includes(orderId) &&
                        intersection(order.orderItems, orderItemIds)
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
