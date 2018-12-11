// @flow
import * as React from 'react';
import ToggleButton from 'modules/relationMap/common/SortFilter/AdvancedFilter/ToggleButton';
import { FilterMenuItemWrapperStyle, FilterMenuItemStyle, FilterMenuLabelStyle } from './style';
import FilterData from '../FilterData';

type Props = {
  name: string,
  field?: string,
  label: React.Node,
  isSelected: boolean,
  changeSelectedFilterItem: (filter: string) => void,
  isActive: boolean,
  toggleActiveFilter: (filter: string) => void,
  onToggleSelect: Function,
  data: any,
};

export default function FilterMenuItem({
  name,
  label,
  field,
  isSelected,
  changeSelectedFilterItem,
  isActive,
  toggleActiveFilter,
  data,
  onToggleSelect,
}: Props) {
  const haveFilterData = Object.keys(data).length > 0;
  return (
    <div className={FilterMenuItemWrapperStyle(isSelected)}>
      <div
        className={FilterMenuItemStyle}
        role="presentation"
        onClick={() => {
          changeSelectedFilterItem(name);
        }}
      >
        <ToggleButton
          isOn={isActive}
          hideToggle={!haveFilterData}
          onClick={() => toggleActiveFilter(name)}
        />
        <div className={FilterMenuLabelStyle}>{label}</div>
      </div>

      {haveFilterData && (
        <FilterData
          name={name}
          field={field}
          data={data}
          onClick={(datum, fieldAttr) => {
            changeSelectedFilterItem(name);
            onToggleSelect(datum, fieldAttr);
          }}
        />
      )}
    </div>
  );
}
