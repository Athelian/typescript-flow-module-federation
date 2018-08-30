// @flow
import React from 'react';
import Icon from 'components/Icon';
import { ExpandButtonsWrapperStyle, ExpandButtonStyle, IconStyle } from './style';

type Props = {
  expanded: boolean,
  onClick: (expanded: boolean) => void,
};

const ExpandButtons = ({ expanded, onClick }: Props) => (
  <div className={ExpandButtonsWrapperStyle}>
    <div className={ExpandButtonStyle} onClick={onClick} role="presentation">
      <div className={IconStyle}>
        <Icon icon="BATCH" />
      </div>
      <div className={IconStyle}>
        <Icon icon={expanded ? 'COMPRESS' : 'EXPAND'} />
      </div>
    </div>
  </div>
);

export default ExpandButtons;
