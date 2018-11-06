// @flow
import React from 'react';
import { Label } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import Icon from 'components/Icon';
import { Panel } from './index';
import { GroupLabelButtonStyle, LabelConnectStyle } from './style';

const ConnectTypePanel = () => (
  <Panel>
    <Label className={LabelConnectStyle}>
      <FormattedMessage {...messages.connect} />
      <Icon icon="CONNECT" />
    </Label>
    <Label className={GroupLabelButtonStyle}>
      <FormattedMessage {...messages.connectType} />
      <BaseButton icon="ORDER" label="ORDER" />
      <BaseButton icon="SHIPMENT" label="SHIPMENT" />
    </Label>
  </Panel>
);

export default ConnectTypePanel;
