// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import ToggleButton from 'modules/relationMap/common/SortFilter/AdvancedFilter/ToggleButton';
import { ToggleMenuItemWrapperStyle, ToggleMenuIconStyle, ToggleMenuLabelStyle } from './style';

type Props = {
  name: string,
  label: React.Node,
  icon: string,
  isActive: boolean,
  toggleFilterToggle: (filter: string) => void,
};

export default function ToggleMenuItem({ name, label, icon, isActive, toggleFilterToggle }: Props) {
  return (
    <div className={ToggleMenuItemWrapperStyle}>
      <div className={ToggleMenuIconStyle}>
        <Icon icon={icon} />
      </div>

      <div className={ToggleMenuLabelStyle}>{label}</div>

      <ToggleButton isOn={isActive} onClick={() => toggleFilterToggle(name)} />
    </div>
  );
}
