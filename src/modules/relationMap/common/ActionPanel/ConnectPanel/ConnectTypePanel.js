// @flow
import React from 'react';
import { Label } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import Icon from 'components/Icon';
import { getByPathWithDefault as get } from 'utils/fp';
import { Panel } from './index';
import { GroupLabelButtonStyle, LabelConnectStyle } from './style';

type Props = {
  onClick: Function,
  targetedItem: Object,
};

const isDisabledConnectShipment = targetedItem => {
  const { batch = {} } = targetedItem;
  const numberOfBatch = Object.keys(batch).length;
  return numberOfBatch === 0;
};

const getExportIdFromBatch = (batch: Object, defaultValue?: any) =>
  get(
    typeof defaultValue !== 'undefined' ? defaultValue : false,
    'orderItem.order.exporter.id',
    batch
  );

const getExportIdFromOrderItem = (orderItem: Object, defaultValue?: any) =>
  get(typeof defaultValue !== 'undefined' ? defaultValue : false, 'order.exporter.id', orderItem);

const isDisabledConnectOrder = (targetedItem: Object) => {
  const { order = {}, orderItem = {}, batch = {} } = targetedItem;
  const numberOfOrder = Object.keys(order).length;
  if (numberOfOrder > 0) {
    return true;
  }
  const orderItemIds = Object.keys(orderItem);
  const batchIds = Object.keys(batch);
  const exportId =
    getExportIdFromOrderItem(orderItem[orderItemIds[0]]) ||
    getExportIdFromBatch(batch[batchIds[0]], null);
  const batchIsSameExporter = !batchIds.some(
    batchId => exportId !== getExportIdFromBatch(batch[batchId], null)
  );
  const orderItemIsSameExporter = !orderItemIds.some(
    orderItemId => exportId !== getExportIdFromOrderItem(orderItem[orderItemId], null)
  );
  const isSameExporter = batchIsSameExporter && orderItemIsSameExporter;
  return isSameExporter;
};

const ConnectTypePanel = ({ onClick, targetedItem }: Props) => (
  <Panel>
    <Label className={LabelConnectStyle}>
      <FormattedMessage {...messages.connect} />
      <Icon icon="CONNECT" />
    </Label>
    <Label className={GroupLabelButtonStyle}>
      <FormattedMessage {...messages.connectType} />
      <BaseButton
        icon="ORDER"
        label="ORDER"
        onClick={() => onClick('ORDER')}
        disabled={isDisabledConnectOrder(targetedItem)}
      />
      <BaseButton
        icon="SHIPMENT"
        label="SHIPMENT"
        onClick={() => onClick('SHIPMENT')}
        disabled={isDisabledConnectShipment(targetedItem)}
      />
    </Label>
  </Panel>
);

export default ConnectTypePanel;
