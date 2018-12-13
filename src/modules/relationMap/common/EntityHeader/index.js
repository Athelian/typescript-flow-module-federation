// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import {Label} from 'components/Form';
import { EntityHeaderWrapperStyle, EntityHeaderIconStyle } from './style';

type Props = {
  icon: string,
  color: string,
  label: string | React.Node,
  no: number,
  onClick?: Function,
};

const EntityHeader = ({ icon, color, label, no, onClick }: Props) => (
  <div className={EntityHeaderWrapperStyle} role="presentation">
    <button type="button" onClick={onClick}>
      <div className={EntityHeaderIconStyle(color)}>
        <Icon icon={icon} />
      </div>
    </button>
      <Label>{label} (<FormattedNumber value={no} />)</Label>
  </div>
);

export default EntityHeader;
