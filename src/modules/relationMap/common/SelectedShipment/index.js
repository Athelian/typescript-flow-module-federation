// @flow
import React from 'react';
import { cx } from 'react-emotion';
import { Label } from 'components/Form';
import * as style from './style';

type Props = {
  onClick: Function,
};
const SelectedShipment = ({ onClick }: Props) => (
  <div className={cx(style.OverlayStyle, style.CenteredStyle)}>
    <button type="button" onClick={onClick}>
      <div className={style.CenteredStyle}>
        <Label>Selected Shipment</Label>
      </div>
    </button>
  </div>
);

export default SelectedShipment;
