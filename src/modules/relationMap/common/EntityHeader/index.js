// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
import { EntityHeaderWrapperStyle, EntityHeaderIconStyle } from './style';

type Props = {
  icon: string,
  color: string,
  label: string | React.Node,
  no: number,
  onClick?: Function,
  children: React.Node,
};

const EntityHeader = ({ icon, color, label, no, onClick, children }: Props) => (
  <div className={EntityHeaderWrapperStyle} role="presentation">
    <button className={EntityHeaderIconStyle(color)} type="button" onClick={onClick}>
      <Icon icon={icon} />
    </button>
    <Label>
      {label} (<FormattedNumber value={no} />)
    </Label>
    {children}
  </div>
);

export default EntityHeader;
