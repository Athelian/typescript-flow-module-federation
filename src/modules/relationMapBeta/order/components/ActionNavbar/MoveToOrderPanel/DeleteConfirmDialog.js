// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import * as style from './style';

const DeleteConfirmDialog = () => (
  <div className={style.ConfirmMessageContainer}>
    <div>
      <FormattedMessage {...messages.confirmMessage} />{' '}
      <div className={style.ConfirmActionStyle}>
        <FormattedMessage {...messages.delete} />
      </div>{' '}
      <FormattedMessage {...messages.confirmDelete} />
    </div>
    <Label className={style.LabelConfirmDeleteStyle}>
      <FormattedMessage {...messages.confirmSubMessage} />
    </Label>
  </div>
);

export default DeleteConfirmDialog;
