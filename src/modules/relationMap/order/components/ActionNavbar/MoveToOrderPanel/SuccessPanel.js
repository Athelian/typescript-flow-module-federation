// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import Icon from 'components/Icon';
import {
  MoveToOrderSuccessPanelWrapperStyle,
  MoveToOrderLabelWrapperStyle,
  MoveToOrderMessageWrapperStyle,
  SuccessPanelButtonCloseStyle,
} from './style';

type Props = {
  onClick: Function,
};

const SuccessPanel = ({ onClick }: Props) => (
  <div className={MoveToOrderSuccessPanelWrapperStyle}>
    <div className={MoveToOrderLabelWrapperStyle} style={{ color: '#fff' }}>
      <Icon icon="EXCHANGE" />
      <Label color="WHITE">
        <FormattedMessage {...messages.moveTo} />
      </Label>
      <Icon icon="ORDER" />
    </div>

    <div className={MoveToOrderMessageWrapperStyle}>
      <Label color="WHITE" align="CENTER">
        <FormattedMessage {...messages.connectSuccess} />
      </Label>
    </div>

    <button className={SuccessPanelButtonCloseStyle} type="button" onClick={onClick}>
      <Icon icon="CLEAR" />
    </button>
  </div>
);

export default SuccessPanel;
