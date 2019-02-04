// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import { LabelConnectStyle, GroupLabelButtonStyle, Panel, FlatButtonStyle } from './style';

type Props = {
  onReset: Function,
  onConfirm: Function,
};

const ApplyPanel = ({ onReset, onConfirm }: Props) => {
  return (
    <Panel>
      <Label className={LabelConnectStyle}>
        <FormattedMessage {...messages.connect} />
        <Icon icon="CONNECT" />
      </Label>
      <Label className={GroupLabelButtonStyle}>
        <FormattedMessage {...messages.askConnectToShipment} />
        <BaseButton label="CLEAR" className={FlatButtonStyle} onClick={onReset} />
        <BaseButton
          icon="CONFIRM"
          label={<FormattedMessage id="components.NavBar.filter.apply" defaultMessage="APPLY" />}
          onClick={onConfirm}
        />
      </Label>
    </Panel>
  );
};

export default ApplyPanel;
