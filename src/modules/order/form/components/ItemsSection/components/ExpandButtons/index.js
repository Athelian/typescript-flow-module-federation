// @flow
import React from 'react';
import Icon from 'components/Icon';
import { ExpandButtonsWrapperStyle, IconStyle } from './style';

type Props = {
  type: 'COMPRESS' | 'EXPAND',
  onClick: (expanded: boolean) => void,
};

const ExpandButtons = ({ type, onClick }: Props) => (
  <div className={ExpandButtonsWrapperStyle} onClick={onClick} role="presentation">
    <div className={IconStyle}>
      <Icon icon="BATCH" />
    </div>
    <div className={IconStyle}>
      <Icon icon={type} />
    </div>
  </div>
);

export default ExpandButtons;
