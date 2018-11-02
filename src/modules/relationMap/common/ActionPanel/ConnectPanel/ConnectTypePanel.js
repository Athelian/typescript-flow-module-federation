import React from 'react';
import { Label } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import { CenterPanel } from './index';

const ConnectTypePanel = () => (
  <CenterPanel>
    <Label>
      <FormattedMessage {...messages.connectType} />
    </Label>
    <BaseButton icon="ORDER" label="ORDER" />
    <BaseButton icon="SHIPMENT" label="SHIPMENT" />
  </CenterPanel>
);

export default ConnectTypePanel;
