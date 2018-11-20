// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FilterMenuItem, ToggleMenuItem } from '../components';
import messages from './messages';
import { OrderFilterMenuWrapperStyle, OrderFiltersBodyStyle, OrderTogglesBodyStyle } from './style';

type Props = {
  activeFilters: Array<string>,
  toggleActiveFilter: (string, string) => void,
  selectedFilterItem: string,
  changeSelectedFilterItem: string => void,
};

export default function OrderFilterMenu({
  activeFilters,
  toggleActiveFilter,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    { name: 'poNo', chosen: [] },
    { name: 'exporter', chosen: [] },
    { name: 'inCharge', chosen: [] },
    { name: 'tags', chosen: [] },
    { name: 'createdAt', chosen: [] },
    { name: 'updatedAt', chosen: [] },
  ];

  const togglesMap = [
    { name: 'completelyBatched', icon: 'BATCH' },
    { name: 'completelyShipped', icon: 'SHIPMENT' },
    { name: 'showActive', icon: 'ACTIVE' },
    { name: 'showArchived', icon: 'ARCHIVE' },
  ];

  return (
    <div className={OrderFilterMenuWrapperStyle}>
      <div className={OrderFiltersBodyStyle}>
        {filtersMap.map(filter => {
          const { name, chosen } = filter;
          const isSelected = selectedFilterItem === name;
          const isActive = activeFilters.some(activeFilter => activeFilter === name);

          return (
            <FilterMenuItem
              name={name}
              label={<FormattedMessage {...messages[name]} />}
              isSelected={isSelected}
              changeSelectedFilterItem={changeSelectedFilterItem}
              isActive={isActive}
              toggleActiveFilter={(fieldName: string) => toggleActiveFilter('order', fieldName)}
              data={chosen}
            />
          );
        })}
      </div>
      <div className={OrderTogglesBodyStyle}>
        {togglesMap.map(toggle => {
          const { name, icon } = toggle;
          const isActive = activeFilters.some(activeFilter => activeFilter === name);

          return (
            <ToggleMenuItem
              name={name}
              label={<FormattedMessage {...messages[name]} />}
              icon={icon}
              isActive={isActive}
              toggleActiveFilter={(fieldName: string) => toggleActiveFilter('order', fieldName)}
            />
          );
        })}
      </div>
    </div>
  );
}
