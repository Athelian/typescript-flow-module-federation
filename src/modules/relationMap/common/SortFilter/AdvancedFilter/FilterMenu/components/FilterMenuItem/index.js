// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleButton } from 'modules/relationMap/common/SortFilter/AdvancedFilter/components';
import {
  FilterMenuItemWrapperStyle,
  FilterMenuItemStyle,
  FilterMenuLabelStyle,
  FilterDataWrapperStyle,
  FilterDataStyle,
} from './style';

type Props = {
  name: string,
  label: React.Node,
  isSelected: boolean,
  changeSelectedFilterItem: (filter: string) => void,
  isActive: boolean,
  toggleActiveFilter: (filter: string) => void,
  data: Array<any>,
};

export default function FilterMenuItem({
  name,
  label,
  isSelected,
  changeSelectedFilterItem,
  isActive,
  toggleActiveFilter,
  data,
}: Props) {
  return (
    <button
      className={FilterMenuItemWrapperStyle(isSelected)}
      onClick={() => changeSelectedFilterItem(name)}
      type="button"
    >
      <div className={FilterMenuItemStyle}>
        <ToggleButton isOn={isActive} onClick={() => toggleActiveFilter(name)} />
        <div className={FilterMenuLabelStyle}>{label}</div>
      </div>

      {data.length > 0 && (
        <div className={FilterDataWrapperStyle}>
          {data.map(datum => (
            <button className={FilterDataStyle} type="button">
              {datum}
              <Icon icon="CLEAR" />
            </button>
          ))}
        </div>
      )}
    </button>
  );
}
