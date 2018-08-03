// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle } from './style';

type Props = {
  icon: string,
  color: string,
};

function EntityIcon({ icon, color }: Props) {
  return (
    <div className={IconStyle(color)}>
      <Icon icon={icon} />
    </div>
  );
}

export default EntityIcon;
