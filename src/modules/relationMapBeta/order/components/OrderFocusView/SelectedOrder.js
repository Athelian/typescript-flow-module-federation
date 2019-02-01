// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { cx } from 'react-emotion';
import { Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import * as style from './style';

type Props = {
  onClick: Function,
};
const SelectedOrder = ({ onClick }: Props) => (
  <div className={cx(style.OverlayStyle, style.CenteredOrderStyle)}>
    <button type="button" onClick={onClick}>
      <Label className={style.LabelStyle}>
        <FormattedMessage {...messages.selectedOrder} />
      </Label>
    </button>
  </div>
);

export default SelectedOrder;
