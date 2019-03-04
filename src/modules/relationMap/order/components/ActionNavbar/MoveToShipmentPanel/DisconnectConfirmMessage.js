// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import { ConfirmMessageContainer, ConfirmActionStyle, LabelConfirmDeleteStyle } from './style';

const DisconnectConfirmMessage = () => (
  <div className={ConfirmMessageContainer}>
    <div className={LabelConfirmDeleteStyle}>
      <FormattedMessage {...messages.confirmMessage} />{' '}
      <span className={ConfirmActionStyle}>
        <FormattedMessage {...messages.disconnect} />
      </span>{' '}
      <FormattedMessage {...messages.confirmDisconnect} />
    </div>
    <div className={LabelConfirmDeleteStyle}>
      <FormattedMessage {...messages.confirmSubMessage} />
    </div>
  </div>
);

export default DisconnectConfirmMessage;
