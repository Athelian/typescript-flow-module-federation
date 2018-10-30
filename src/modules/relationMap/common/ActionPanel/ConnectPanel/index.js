// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import * as style from './style';

type Props = {
  onConnectNewShipment: Function,
  onConnectExistingShipment: Function,
};
const ConnectPanel = ({ onConnectNewShipment, onConnectExistingShipment }: Props) => (
  <div className={style.PanelWrapperStyle}>
    <Label>
      <FormattedMessage {...messages.connect} />
    </Label>
    <Label>
      <FormattedMessage {...messages.select} />
    </Label>
    <div style={{ fontSize: '10px' }}>
      <Icon icon="SHIPMENT" />
    </div>

    <Label>
      <FormattedMessage {...messages.shipmentsTab} />
    </Label>

    <Label>
      <FormattedMessage {...messages.connectShipment} />
    </Label>
    <Label>
      <FormattedMessage {...messages.connectTo} />
    </Label>
    <BaseButton
      icon="ADD"
      onClick={onConnectNewShipment}
      label={<FormattedMessage {...messages.newShipment} />}
    />
    <button type="button" onClick={onConnectExistingShipment}>
      Existing Shipment
    </button>
  </div>
);

export default ConnectPanel;
