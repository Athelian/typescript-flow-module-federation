// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { DateRange } from './components';
import { FilterInputAreaWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
};

const getFilterInputArea = (selectedEntityType: EntityTypes, selectedFilterItem: string) => {
  switch (selectedEntityType) {
    case 'order': {
      switch (selectedFilterItem) {
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        default:
          return DateRange;
      }
    }
    case 'item':
      return DateRange;
    case 'batch':
      return DateRange;
    case 'shipment':
      return DateRange;
    default:
      return DateRange;
  }
};

export default function FilterInputArea({ selectedEntityType, selectedFilterItem }: Props) {
  const SelectedFilterInputArea = getFilterInputArea(selectedEntityType, selectedFilterItem);

  return (
    <div className={FilterInputAreaWrapperStyle}>
      <SelectedFilterInputArea />
    </div>
  );
}
