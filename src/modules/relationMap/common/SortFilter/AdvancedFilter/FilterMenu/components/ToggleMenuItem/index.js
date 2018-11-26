// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleButton } from 'modules/relationMap/common/SortFilter/AdvancedFilter/components';
import { ToggleMenuItemWrapperStyle, ToggleMenuIconStyle, ToggleMenuLabelStyle } from './style';

type Props = {
  name: string,
  label: React.Node,
  icon: string,
  isActive: boolean,
  toggleActiveFilter: (filter: string) => void,
};

export default function ToggleMenuItem({ name, label, icon, isActive, toggleActiveFilter }: Props) {
  return (
    <div className={ToggleMenuItemWrapperStyle}>
      <div className={ToggleMenuIconStyle}>
        <Icon icon={icon} />
      </div>

      <div className={ToggleMenuLabelStyle}>{label}</div>

      <ToggleButton isOn={isActive} onClick={() => toggleActiveFilter(name)} />
    </div>
  );
}
