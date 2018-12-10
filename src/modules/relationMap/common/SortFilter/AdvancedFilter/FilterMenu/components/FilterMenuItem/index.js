// @flow
import * as React from 'react';
import { isDataType } from 'utils/fp';
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
          hideToggle={!((isDataType(Object, data) ? Object.keys(data) : data).length > 0)}
          onClick={() => toggleActiveFilter(name)}
        />
        <div className={FilterMenuLabelStyle}>{label}</div>
      </div>

      {Object.keys(data).length > 0 && (
        <FilterData
          field={field}
          data={data}
          onClick={(datum, fieldAttr) => {
            toggleActiveFilter(name);
            onToggleSelect(datum, fieldAttr);
            toggleActiveFilter(name);
          }}
        />
      )}
    </div>
  );
}
