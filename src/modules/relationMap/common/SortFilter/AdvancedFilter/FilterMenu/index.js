// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import OrderFilterMenu from './OrderFilterMenu';
import { FilterMenuWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  filterData: any,
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
      return '';
  }
};

export default function FilterMenu({ selectedEntityType, filterData }: Props) {
  const SelectedFilterMenu = getFilterMenu(selectedEntityType);

  return (
    <div className={FilterMenuWrapperStyle}>
      <SelectedFilterMenu data={filterData[selectedEntityType]} />
    </div>
  );
}
