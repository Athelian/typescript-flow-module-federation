// @flow
import * as React from 'react';
import { ToggleButton } from '..';
import { FilterMenuItemWrapperStyle, FilterMenuItemStyle, FilterMenuLabelStyle } from './style';

type Props = {
  name: string,
  label: React.Node,
  isSelected: boolean,
  changeSelectedFilter: (filter: string) => void,
  isActive: boolean,
  toggleActiveFilter: (filter: string) => void,
};

export default function FilterMenuItem({
  name,
  label,
  isSelected,
  changeSelectedFilter,
  isActive,
  toggleActiveFilter,
}: Props) {
  return (
    <div
      className={FilterMenuItemWrapperStyle(isSelected)}
      onClick={() => changeSelectedFilter(name)}
      role="presentation"
    >
      <div className={FilterMenuItemStyle}>
        <ToggleButton isOn={isActive} onClick={() => toggleActiveFilter(name)} />
        <div className={FilterMenuLabelStyle}>{label}</div>
      </div>
    </div>
  );
}
