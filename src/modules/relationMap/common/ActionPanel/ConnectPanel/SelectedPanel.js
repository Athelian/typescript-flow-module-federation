// @flow
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import { getByPathWithDefault as get, omit, compose } from 'utils/fp';
import { cleanUpData } from 'utils/data';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import { ToggleSlide } from 'modules/relationMap/common/SlideForm';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import { shipmentRMCardQuery } from 'modules/relationMap/orderFocused/query';
import { orderFormQuery } from 'modules/order/form/query';
import { OrderItemsContainer, OrderInfoContainer } from 'modules/order/form/containers';
import RelationMapContainer from 'modules/relationMap/container';
import { ActionContainer, ConnectContainer } from 'modules/relationMap/containers';
import {
  removeAdditionBatchFields,
  removeAdditionOrderItemFields,
} from 'modules/relationMap/orderFocused/formatter';
import { getItemType } from 'modules/relationMap/orderFocused/Item';
import * as style from './style';

const { SelectedPanelWrapper } = style;

type Props = {
  connectType: string,
};

const getConnectTypeMessage = (type: string) => {
  switch (type) {
    default:
    case 'ORDER':
      return messages.ordersTab;
    case 'SHIPMENT':
      return messages.shipmentsTab;
  }
};

const getNewConnectTypeMessage = (type: string) => {
  switch (type) {
    default:
    case 'ORDER':
      return messages.newOrder;
    case 'SHIPMENT':
      return messages.newShipment;
  }
};

const isSameCurrency = (currency: string) => (item: Object) => {
  const compareCurrency = get(null, `order.currency`, item);
  return compareCurrency === currency;
};

const ConfirmMessage = ({ connectType }: Props) => {
  switch (connectType) {
    default:
    case 'ORDER':
      return (
        <div className={style.ConfirmMessageContainer}>
          <div>
            <FormattedMessage {...messages.confirmMessage} />{' '}
            <div className={style.ConfirmActionStyle}>
              <FormattedMessage {...messages.delete} />
            </div>{' '}
            <FormattedMessage {...messages.confirmDelete} />
          </div>
          <Label className={style.LabelConfirmDeleteStyle}>
            <FormattedMessage {...messages.confirmSubMessage} />
          </Label>
        </div>
      );

    case 'SHIPMENT':
      return (
        <div className={style.ConfirmMessageContainer}>
          <div>
            <FormattedMessage {...messages.confirmMessage} />
          </div>{' '}
          <span className={style.ConfirmActionStyle}>
            <FormattedMessage {...messages.disconnect} />
          </span>{' '}
          <FormattedMessage {...messages.confirmDisconnect} />
          <Label>
            <FormattedMessage {...messages.confirmSubMessage} />
          </Label>
        </div>
      );
  }
};

const ClearMessage = ({ connectType }: Props) => {
  switch (connectType) {
    default:
    case 'ORDER':
      return <FormattedMessage {...messages.delete} />;
    case 'SHIPMENT':
      return <FormattedMessage {...messages.disconnect} />;
  }
};

const SelectedPanel = ({ connectType }: Props) => (
  <SelectedPanelWrapper>
    <div className={style.SubPanel}>
      <Label className={style.LabelConnectStyle}>
        <FormattedMessage {...messages.connect} />
        <Icon icon="CONNECT" />
      </Label>
      <Label className={style.GroupLabelButtonLeftStyle}>
        <FormattedMessage {...messages.select} />
        <Label color={connectType} className={style.GroupLabelButtonStyle}>
          <Icon icon={connectType} />
          <FormattedMessage {...getConnectTypeMessage(connectType)} />
        </Label>
        <FormattedMessage {...messages.toConnectToTheList} />
      </Label>
    </div>
    <div className={style.SubPanel}>
      <Label className={style.GroupLabelButtonStyle}>
        <FormattedMessage {...messages.connectTo} />
        <ToggleSlide>
          {({ assign: setSlide }) => (
            <ApolloConsumer>
              {client => (
                <Subscribe
                  to={[
                    RelationMapContainer,
                    ActionContainer,
                    ShipmentBatchesContainer,
                    OrderItemsContainer,
                    OrderInfoContainer,
                    ConnectContainer,
                  ]}
                >
                  {(
                    { state: { targetedItem }, addTarget, isHighlighted, selectFocusItem },
                    { setResult },
                    batchContainer,
                    orderItemContainer,
                    orderInfoContainer,
                    { setSuccess, deleteItemAndBatchInOrder }
                  ) => (
                    <>
                      <BaseButton
                        icon="ADD"
                        label={
                          <FormattedMessage
                            {...getNewConnectTypeMessage(connectType)}
                            className={style.PanelButtonStyle}
                          />
                        }
                        onClick={() => {
                          const { batch, orderItem } = targetedItem;
                          const batchIds = Object.keys(batch || {});
                          const orderItemIds = Object.keys(orderItem || {});
                          if (connectType === 'SHIPMENT') {
                            const batches = batchIds.map(batchId =>
                              removeAdditionBatchFields(batch[batchId])
                            );
                            batchContainer.initDetailValues(batches);
                          }
                          if (connectType === 'ORDER') {
                            const orderItemObj = batchIds
                              .filter(batchId => {
                                const currentBatch = batch[batchId];
                                const orderItemId =
                                  get(false, 'orderItem.id', currentBatch) || currentBatch.parentId;
                                return !orderItem[orderItemId];
                              })
                              .reduce((obj, batchId) => {
                                const currentOrderItem = get(false, 'orderItem', batch[batchId]);
                                return Object.assign(obj, {
                                  [currentOrderItem.id]: {
                                    ...currentOrderItem,
                                    batches: [
                                      ...get([], `${currentOrderItem.id}.batches`, obj),
                                      batch[batchId],
                                    ],
                                  },
                                });
                              }, {});
                            const filteredOrderItemIds = Object.keys(orderItemObj);
                            const filteredOrderItems = filteredOrderItemIds.map(
                              orderItemId => orderItemObj[orderItemId]
                            );
                            const orderItems = orderItemIds.map(
                              orderItemId => orderItem[orderItemId]
                            );
                            const allOrderItem = orderItems.concat(filteredOrderItems);

                            const [firstItem] = allOrderItem || [];
                            const firstCurrency = get('', 'order.currency', firstItem);
                            const exporter = get('', 'order.exporter', firstItem);
                            const sameCurrency = allOrderItem.every(isSameCurrency(firstCurrency));
                            const currency = sameCurrency ? firstCurrency : null;
                            const formatedOrderItem = allOrderItem.map(currentOrderItem => {
                              const orderItemInput = removeAdditionOrderItemFields(
                                currentOrderItem
                              );
                              const batches = currentOrderItem.batches.map(
                                compose(
                                  removeAdditionBatchFields,
                                  omit(['updatedBy', 'updatedAt', 'archived']),
                                  cleanUpData
                                )
                              );
                              return isSameCurrency
                                ? { ...orderItemInput, batches }
                                : Object.assign(orderItemInput, {
                                    price: { amount: 0, currency: 'ALL' },
                                    batches,
                                  });
                            });
                            orderItemContainer.initDetailValues(formatedOrderItem);
                            orderInfoContainer.initDetailValues({
                              exporter,
                              currency,
                            });
                          }
                          setSlide({
                            show: true,
                            type: `NEW_${connectType}`,
                            onSuccess: async data => {
                              let result = null;
                              const itemType = getItemType(connectType);
                              if (connectType === 'ORDER') {
                                await deleteItemAndBatchInOrder(client, targetedItem);
                                // $FlowFixMe flow error on apollo client https://github.com/flow-typed/flow-typed/issues/2233
                                const { data: orderData } = await client.query({
                                  query: orderFormQuery,
                                  variables: {
                                    id: get(null, 'orderCreate.order.id', data),
                                  },
                                });
                                result = { ...orderData.order, actionType: 'newItem' };
                              }
                              if (connectType === 'SHIPMENT') {
                                const shipmentId = get('', 'shipmentCreate.shipment.id', data);
                                // $FlowFixMe flow error on apollo client https://github.com/flow-typed/flow-typed/issues/2233
                                const { data: shipmentData } = await client.query({
                                  query: shipmentRMCardQuery,
                                  variables: {
                                    id: shipmentId,
                                  },
                                });
                                result = { ...shipmentData.shipment, actionType: 'newItem' };
                                const isFocus = batchIds.some(batchId =>
                                  isHighlighted(batchId, 'batch')
                                );
                                if (isFocus) {
                                  selectFocusItem(prevFocus => ({
                                    ...prevFocus,
                                    shipment: { [shipmentId]: true },
                                  }));
                                }
                              }
                              addTarget(
                                { data: result, relation: {} },
                                { id: result && result.id, type: connectType },
                                itemType
                              );
                              setResult(prevState =>
                                Object.assign(prevState, {
                                  result: Object.assign(prevState.result, {
                                    [itemType]: [result],
                                  }),
                                })
                              );
                              setSuccess(true);
                            },
                          });
                        }}
                      />
                    </>
                  )}
                </Subscribe>
              )}
            </ApolloConsumer>
          )}
        </ToggleSlide>
      </Label>
    </div>
    <BooleanValue>
      {({ value: isOpen, set: dialogToggle }) => (
        <>
          <Label className={style.GroupLabelButtonStyle}>
            <BaseButton
              icon="CLEAR"
              label={<ClearMessage connectType={connectType} />}
              className={style.PanelButtonStyle}
              onClick={() => dialogToggle(true)}
            />
          </Label>
          <ApolloConsumer>
            {client => (
              <Subscribe to={[RelationMapContainer, ConnectContainer, ActionContainer]}>
                {(
                  { state: { targetedItem }, isHighlighted, selectFocusItem, cancelTarget },
                  { disconnectShipment, deleteItemAndBatchInOrder },
                  { setLoading }
                ) => (
                  <ConfirmDialog
                    onRequestClose={() => dialogToggle(false)}
                    onCancel={() => dialogToggle(false)}
                    isOpen={isOpen}
                    message={<ConfirmMessage connectType={connectType} />}
                    width={300}
                    onConfirm={async () => {
                      setLoading(true);
                      if (connectType === 'SHIPMENT') {
                        await disconnectShipment(client, targetedItem);
                        const { batch = {} } = targetedItem;
                        const isFocus = Object.keys(batch).some(batchId =>
                          isHighlighted(batchId, 'batch')
                        );
                        if (isFocus) {
                          selectFocusItem(prevFocus => ({
                            ...prevFocus,
                            shipment: {},
                          }));
                        }
                      } else if (connectType === 'ORDER') {
                        await deleteItemAndBatchInOrder(client, targetedItem);
                      }
                      cancelTarget();
                      setLoading(false);
                      dialogToggle(false);
                    }}
                  />
                )}
              </Subscribe>
            )}
          </ApolloConsumer>
        </>
      )}
    </BooleanValue>
  </SelectedPanelWrapper>
);

export default SelectedPanel;
