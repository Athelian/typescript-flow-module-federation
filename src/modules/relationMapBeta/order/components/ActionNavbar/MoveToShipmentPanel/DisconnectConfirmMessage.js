// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import * as style from './style';

const DisconnectConfirmMessage = () => (
  <div className={style.ConfirmMessageContainer}>
    <div>
      <FormattedMessage {...messages.confirmMessage} />
    </div>
    <span className={style.ConfirmActionStyle}>
      <FormattedMessage {...messages.disconnect} />
    </span>
    <FormattedMessage {...messages.confirmDisconnect} />
    <Label>
      <FormattedMessage {...messages.confirmSubMessage} />
    </Label>
  </div>
);

export default DisconnectConfirmMessage;
