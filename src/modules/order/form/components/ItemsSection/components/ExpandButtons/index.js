// @flow
import React from 'react';
import Icon from 'components/Icon';
import { ExpandButtonsWrapperStyle, IconStyle } from './style';

type Props = {
  expanded: boolean,
  type: 'COMPRESS' | 'EXPAND',
  onClick: (expanded: boolean) => void,
};

const ExpandButtons = ({ expanded, type, onClick }: Props) => (
  <div className={ExpandButtonsWrapperStyle(expanded)} onClick={onClick} role="presentation">
    <div className={IconStyle}>
      <Icon icon="BATCH" />
    </div>
    <div className={IconStyle}>
      <Icon icon={type} />
    </div>
  </div>
);

export default ExpandButtons;
