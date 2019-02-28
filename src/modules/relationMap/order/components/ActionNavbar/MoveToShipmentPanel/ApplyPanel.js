// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { CancelButton, YesButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import {
  MoveToShipmentPanelWrapperStyle,
  MoveToShipmentLabelWrapperStyle,
  MoveToShipmentMessageWrapperStyle,
  MoveToShipmentButtonsWrapperStyle,
} from './style';

type Props = {
  onReset: Function,
  onConfirm: Function,
};

const ApplyPanel = ({ onReset, onConfirm }: Props) => {
  return (
    <div className={MoveToShipmentPanelWrapperStyle}>
      <div className={MoveToShipmentLabelWrapperStyle}>
        <Icon icon="EXCHANGE" />
        <Label color="TEAL_DARK">
          <FormattedMessage {...messages.connect} />
        </Label>
        <Icon icon="SHIPMENT" />
      </div>

      <div className={MoveToShipmentMessageWrapperStyle}>
        <Label color="TEAL_DARK" align="CENTER">
          <FormattedMessage {...messages.askConnectToShipment} />
        </Label>
      </div>

      <div className={MoveToShipmentButtonsWrapperStyle}>
        <CancelButton onClick={onReset} />

        <YesButton onClick={onConfirm} />
      </div>
    </div>
  );
};

export default ApplyPanel;
