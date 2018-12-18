// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import ToggleButton from 'modules/relationMap/common/SortFilter/AdvancedFilter/ToggleButton';
import {
  isValidOfMetricRangeInput,
  isValidOfPortsInput,
} from 'modules/relationMap/common/SortFilter/AdvancedFilter/utils';
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

function isValid(name: string, data: any): boolean {
  switch (name) {
    case 'tags':
    case 'origin':
      return data.filter(item => !isNullOrUndefined(item)).length > 0;

    case 'packaging': {
      const { packageLength, packageWidth, packageHeight, packageVolume, packageWeight } = data;
      return (
        isValidOfMetricRangeInput(packageLength) ||
        isValidOfMetricRangeInput(packageWidth) ||
        isValidOfMetricRangeInput(packageHeight) ||
        isValidOfMetricRangeInput(packageVolume) ||
        isValidOfMetricRangeInput(packageWeight)
      );
    }
    case 'airports': {
      const { loadPorts, dischargePorts, firstTransitPorts, secondTransitPorts } = data;
      return (
        isValidOfPortsInput(loadPorts) ||
        isValidOfPortsInput(dischargePorts) ||
        isValidOfPortsInput(firstTransitPorts) ||
        isValidOfPortsInput(secondTransitPorts)
      );
    }
    default:
      return Object.keys(data).length > 0;
  }
}

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
  const isValidOfFilterData = isValid(name, data);
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
          hideToggle={!isValidOfFilterData}
          onClick={() => toggleActiveFilter(name)}
        />
        <div className={FilterMenuLabelStyle}>{label}</div>
      </div>

      {isValidOfFilterData && (
        <FilterData
          name={name}
          field={field}
          data={data}
          onRemove={(datum, fieldAttr) => {
            changeSelectedFilterItem(name);
            onToggleSelect(datum, fieldAttr);
          }}
        />
      )}
    </div>
  );
}
