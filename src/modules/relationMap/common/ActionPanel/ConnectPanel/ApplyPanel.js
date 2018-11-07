// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import { LabelConnectStyle, GroupLabelButtonStyle, Panel, FlatButtonStyle } from './style';

type Props = {
  type: 'SHIPMENT' | 'ORDER',
};

const ApplyPanel = ({ type }: Props) => {
  let text;
  switch (type) {
    default:
    case 'SHIPMENT':
      text = <FormattedMessage {...messages.askConnectToShipment} />;
      break;
    case 'ORDER':
      text = <FormattedMessage {...messages.askConnectToOrder} />;
  }

  return (
    <Panel>
      <Label className={LabelConnectStyle}>
        <FormattedMessage {...messages.connect} />
        <Icon icon="CONNECT" />
      </Label>
      <Label className={GroupLabelButtonStyle}>
        {text}
        <BaseButton label="CLEAR" className={FlatButtonStyle} />
        <BaseButton icon="CONFIRM" label="APPLY" />
      </Label>
    </Panel>
  );
};

ApplyPanel.defaultProps = {
  type: 'SHIPMENT',
};

export default ApplyPanel;
