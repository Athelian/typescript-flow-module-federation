// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { DateRange, Tags } from './components';
import { FilterInputAreaWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
};

const Placeholder = () => <div>Not done</div>;

const getFilterInputArea = (selectedEntityType: EntityTypes, selectedFilterItem: string) => {
  switch (selectedEntityType) {
    case 'order': {
      switch (selectedFilterItem) {
        case 'poNo':
          return Placeholder;
        case 'exporter':
          return Placeholder;
        case 'inCharge':
          return Placeholder;
        case 'tags':
          return Tags;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        default:
          return Placeholder;
      }
    }
    case 'item':
      switch (selectedFilterItem) {
        case 'price':
          return Placeholder;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        case 'tags':
          return Tags;
        case 'exporter':
          return Placeholder;
        case 'supplier':
          return Placeholder;
        case 'origin':
          return Placeholder;
        case 'specifications':
          return Placeholder;
        case 'productionLeadTime':
          return Placeholder;
        case 'packaging':
          return Placeholder;
        default:
          return Placeholder;
      }
    case 'batch':
      return Placeholder;
    case 'shipment':
      return Placeholder;
    default:
      return Placeholder;
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
