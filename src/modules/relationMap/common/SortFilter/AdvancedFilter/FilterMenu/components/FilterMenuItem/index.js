// @flow
import * as React from 'react';
import { get } from 'lodash/fp';
import Icon from 'components/Icon';
import ToggleButton from 'modules/relationMap/common/SortFilter/AdvancedFilter/ToggleButton';
import {
  FilterMenuItemWrapperStyle,
  FilterMenuItemStyle,
  FilterMenuLabelStyle,
  FilterDataWrapperStyle,
  FilterDataStyle,
} from './style';

type Props = {
  name: string,
  field?: string,
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
  field,
  isSelected,
  changeSelectedFilterItem,
  isActive,
  toggleActiveFilter,
  data,
}: Props) {
  return (
    <div
      className={FilterMenuItemWrapperStyle(isSelected)}
      onClick={() => changeSelectedFilterItem(name)}
      role="presentation"
    >
      <div className={FilterMenuItemStyle}>
        <ToggleButton
          isOn={isActive}
          hideToggle={!(data.length > 0)}
          onClick={() => toggleActiveFilter(name)}
        />
        <div className={FilterMenuLabelStyle}>{label}</div>
      </div>

      {data.length > 0 && (
        <div className={FilterDataWrapperStyle}>
          {data.map(datum => (
            <button key={datum.id} className={FilterDataStyle} type="button">
              {field && get(field, datum)}
              <Icon icon="CLEAR" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
