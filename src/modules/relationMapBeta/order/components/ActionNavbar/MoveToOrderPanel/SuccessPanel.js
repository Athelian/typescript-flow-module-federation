// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import Icon from 'components/Icon';
import {
  SuccessPanelButtonCloseStyle,
  SuccessPanelWrapper,
  GroupLabelButtonStyle,
  LabelConnectStyle,
} from './style';

type Props = {
  onClick: Function,
};
const SuccessPanel = ({ onClick }: Props) => (
  <SuccessPanelWrapper>
    <Label className={LabelConnectStyle}>
      <FormattedMessage {...messages.connect} />
      <Icon icon="CONNECT" />
    </Label>
    <Label className={GroupLabelButtonStyle}>
      <FormattedMessage {...messages.connectSuccess} />
    </Label>
    <button className={SuccessPanelButtonCloseStyle} type="button" onClick={onClick}>
      <Icon icon="CANCEL" />
    </button>
  </SuccessPanelWrapper>
);

export default SuccessPanel;
