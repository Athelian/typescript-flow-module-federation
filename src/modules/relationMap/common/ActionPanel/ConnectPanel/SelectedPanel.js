// @flow
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { getByPathWithDefault as get } from 'utils/fp';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import { ToggleSlide } from 'modules/relationMap/common/SlideForm';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import { shipmentFormQuery } from 'modules/shipment/form/query';
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
                    { state: { targetedItem }, addTarget },
                    { setResult },
                    batchContainer,
                    orderItemContainer,
                    orderInfoContainer,
                    { setSuccess }
                  ) => (
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
                              const orderItemId = get(false, 'orderItem.id', batch[batchId]);
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

                          const firstItem = allOrderItem[0]; // orderItem[head(orderItemIds)];
                          const firstCurrency = get('', 'order.currency', firstItem);
                          const exporter = get('', 'order.exporter', firstItem);
                          const sameCurrency = allOrderItem.every(isSameCurrency(firstCurrency));
                          const currency = sameCurrency ? firstCurrency : null;
                          const formatedOrderItem = allOrderItem.map(currentOrderItem => {
                            const orderItemInput = removeAdditionOrderItemFields(currentOrderItem);
                            return isSameCurrency
                              ? orderItemInput
                              : Object.assign(orderItemInput, {
                                  price: { amount: 0, currency: 'ALL' },
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
                            if (connectType === 'ORDER') {
                              result = get(null, 'orderCreate.order', data);
                            }
                            if (connectType === 'SHIPMENT') {
                              // $FlowFixMe flow error on apollo client https://github.com/flow-typed/flow-typed/issues/2233
                              const { data: shipmentData } = await client.query({
                                query: shipmentFormQuery,
                                variables: {
                                  id: get('', 'shipmentCreate.shipment.id', data),
                                },
                              });
                              result = { ...shipmentData.shipment, actionType: 'newItem' };
                              addTarget(
                                { data: result, relation: {} },
                                { id: result.id, type: 'SHIPMENT' },
                                getItemType(connectType)
                              );
                            }
                            setResult(prevState =>
                              Object.assign(prevState, {
                                result: Object.assign(prevState.result, {
                                  [getItemType(connectType)]: [result],
                                }),
                              })
                            );
                            setSuccess(true);
                          },
                        });
                      }}
                    />
                  )}
                </Subscribe>
              )}
            </ApolloConsumer>
          )}
        </ToggleSlide>
      </Label>
    </div>
    <Label className={style.GroupLabelButtonStyle}>
      <BaseButton icon="CLEAR" label="Disconnect" className={style.PanelButtonStyle} />
    </Label>
  </SelectedPanelWrapper>
);

export default SelectedPanel;
