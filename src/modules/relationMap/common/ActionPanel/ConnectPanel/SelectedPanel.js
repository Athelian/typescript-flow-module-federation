// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import * as style from './style';

const { Panel } = style;

const SelectedPanel = () => (
  <Panel>
    <div className={style.SubPanel(3)}>
      <div style={{ flex: 1 }}>
        <Label>
          <FormattedMessage {...messages.connect} />
        </Label>
      </div>
      <div style={{ flex: 1 }}>
        <Label>
          <FormattedMessage {...messages.select} />
        </Label>
      </div>

      <div className={style.GroupItem} style={{ fontSize: '10px', flex: 1 }}>
        <Icon icon="SHIPMENT" />
        <Label>
          <FormattedMessage {...messages.shipmentsTab} />
        </Label>
      </div>
      <div style={{ flex: 1.8 }}>
        <Label>
          <FormattedMessage {...messages.connectShipment} />
        </Label>
      </div>
    </div>
    <div className={style.SubPanel(2)}>
      <div style={{ flex: 1 }}>
        <Label>
          <FormattedMessage {...messages.connectTo} />
        </Label>
      </div>
      <div style={{ flex: 1 }}>
        <BaseButton icon="ADD" label={<FormattedMessage {...messages.newShipment} />} />
      </div>
    </div>
    <div className={style.CancelPanel(1)}>
      <BaseButton icon="CLEAR" label="Disconnect" />
    </div>
  </Panel>
);

export default SelectedPanel;
