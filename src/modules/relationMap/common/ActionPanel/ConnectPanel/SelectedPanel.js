// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { head, getByPathWithDefault as get } from 'utils/fp';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import { ToggleSlide } from 'modules/relationMap/common/SlideForm';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import { OrderItemsContainer, OrderInfoContainer } from 'modules/order/form/containers';
import RelationMapContainer from 'modules/relationMap/container';
import {
  removeAdditionBatchFields,
  removeAdditionOrderItemFields,
} from 'modules/relationMap/orderFocused/formatter';
import * as style from './style';

const { SelectedPanelWrapper } = style;

type Props = {
  connect: Object,
};

const getConnectTypeMessage = type => {
  switch (type) {
    default:
    case 'ORDER':
      return messages.ordersTab;
    case 'SHIPMENT':
      return messages.shipmentsTab;
  }
};

const getNewConnectTypeMessage = type => {
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

const SelectedPanel = ({ connect }: Props) => {
  const {
    state: { connectType },
  } = connect;
  return (
    <SelectedPanelWrapper>
      <div className={style.SubPanel}>
        <Label className={style.LabelConnectStyle}>
          <FormattedMessage {...messages.connect} />
          <Icon icon="CONNECT" />
        </Label>
        <Label className={style.GroupLabelButtonLeftStyle}>
          <FormattedMessage {...messages.select} />
          <Label color={type} className={style.GroupLabelButtonStyle}>
            <Icon icon={type} />
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
              <Subscribe
                to={[
                  RelationMapContainer,
                  ShipmentBatchesContainer,
                  OrderItemsContainer,
                  OrderInfoContainer,
                ]}
              >
                {(
                  { state: { targetedItem } },
                  batchContainer,
                  orderItemContainer,
                  orderInfoContainer
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
                        const orderItems = orderItemIds.map(orderItemId =>
                          removeAdditionOrderItemFields(orderItem[orderItemId])
                        );
                        orderItemContainer.initDetailValues(orderItems);
                        const firstItem = orderItem[head(orderItemIds)];
                        const firstCurrency = get('', 'order.currency', firstItem);
                        const exporter = get('', 'order.exporter.id', firstItem);
                        const currency = orderItems.every(isSameCurrency(firstCurrency))
                          ? firstCurrency
                          : null;
                        orderInfoContainer.initDetailValues({
                          exporter,
                          currency,
                        });
                      }
                      setSlide({
                        show: true,
                        type: `NEW_${connectType}`,
                        onSuccess: d => console.log(d),
                      });
                    }}
                  />
                )}
              </Subscribe>
            )}
          </ToggleSlide>
        </Label>
      </div>
      <Label className={style.GroupLabelButtonStyle}>
        <BaseButton icon="CLEAR" label="Disconnect" className={style.PanelButtonStyle} />
      </Label>
    </SelectedPanelWrapper>
  );
};

SelectedPanel.defaultProps = {
  type: 'SHIPMENT',
};

export default SelectedPanel;
