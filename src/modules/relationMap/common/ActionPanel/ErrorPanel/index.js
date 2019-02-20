// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import Icon from 'components/Icon';
import * as style from './style';

type Props = {
  onClickRefresh: Function,
  onClickCancel: Function,
};
const ErrorPanel = ({ onClickCancel, onClickRefresh }: Props) => (
  <div className={style.ContainerWrapper}>
    <div />
    <div>
      <FormattedMessage {...messages.tryAgain} />
      <button className={style.TryAgaingButton} type="button" onClick={onClickRefresh}>
        <Icon icon="SYNC" />
      </button>
    </div>
    <button className={style.CancelButtonStyle} type="button" onClick={onClickCancel}>
      <Icon icon="CANCEL" />
    </button>
  </div>
);

export default ErrorPanel;
