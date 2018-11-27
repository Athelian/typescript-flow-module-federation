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
const SelectedShipment = ({ onClick }: Props) => (
  <div className={cx(style.OverlayStyle, style.CenteredStyle)}>
    <button type="button" onClick={onClick}>
      <div className={style.CenteredStyle}>
        <Label className={style.LabelShipmentStyle}>
          <FormattedMessage {...messages.selectedShipment} />
        </Label>
      </div>
    </button>
  </div>
);

export default SelectedShipment;
