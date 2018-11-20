// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import OrderFilterMenu from './OrderFilterMenu';
import { FilterMenuWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  activeFilters: {
    order: Array<string>,
    item: Array<string>,
    batch: Array<string>,
    shipment: Array<string>,
  },
  toggleActiveFilter: (string, string) => void,
  selectedFilterItem: string,
  changeSelectedFilterItem: string => void,
};

const getFilterMenu = (selectedEntityType: EntityTypes) => {
  switch (selectedEntityType) {
    case 'order':
      return OrderFilterMenu;
    case 'item':
      return OrderFilterMenu;
    case 'batch':
      return OrderFilterMenu;
    case 'shipment':
      return OrderFilterMenu;
    default:
      return OrderFilterMenu;
  }
};

export default function FilterMenu({
  selectedEntityType,
  activeFilters,
  toggleActiveFilter,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const SelectedFilterMenu = getFilterMenu(selectedEntityType);

  return (
    <div className={FilterMenuWrapperStyle}>
      <SelectedFilterMenu
        activeFilters={activeFilters[selectedEntityType]}
        toggleActiveFilter={toggleActiveFilter}
        selectedFilterItem={selectedFilterItem}
        changeSelectedFilterItem={changeSelectedFilterItem}
      />
    </div>
  );
}
