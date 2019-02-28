// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import Icon from 'components/Icon';
import {
  MoveToShipmentSuccessPanelWrapperStyle,
  MoveToShipmentLabelWrapperStyle,
  MoveToShipmentMessageWrapperStyle,
  MoveToShipmentSuccessCloseButtonStyle,
} from './style';

type Props = {
  onClick: Function,
};

const SuccessPanel = ({ onClick }: Props) => (
  <div className={MoveToShipmentSuccessPanelWrapperStyle}>
    <div className={MoveToShipmentLabelWrapperStyle} style={{ color: '#fff' }}>
      <Icon icon="EXCHANGE" />
      <Label color="WHITE">
        <FormattedMessage {...messages.moveTo} />
      </Label>
      <Icon icon="SHIPMENT" />
    </div>

    <div className={MoveToShipmentMessageWrapperStyle}>
      <Label color="WHITE" align="CENTER">
        <FormattedMessage {...messages.connectSuccess} />
      </Label>
    </div>

    <button className={MoveToShipmentSuccessCloseButtonStyle} type="button" onClick={onClick}>
      <Icon icon="CLEAR" />
    </button>
  </div>
);

export default SuccessPanel;
