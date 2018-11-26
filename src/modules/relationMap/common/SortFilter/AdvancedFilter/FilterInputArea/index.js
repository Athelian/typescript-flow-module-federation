// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { DateRange, DayRange, Ports, PriceRange, Specifications, Tags } from './components';
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
          return PriceRange;
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
          return Specifications;
        case 'productionLeadTime':
          return DayRange;
        case 'packaging':
          return Placeholder;
        default:
          return Placeholder;
      }
    case 'batch':
      switch (selectedFilterItem) {
        case 'deliveredAt':
          return DateRange;
        case 'expiredAt':
          return DateRange;
        case 'producedAt':
          return DateRange;
        case 'packaging':
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
    case 'shipment':
      switch (selectedFilterItem) {
        case 'forwarder':
          return Placeholder;
        case 'inCharge':
          return Placeholder;
        case 'seaports':
          return () => Ports({ portType: 'Seaport' });
        case 'airports':
          return () => Ports({ portType: 'Airport' });
        case 'cargoReady':
          return DateRange;
        case 'loadPortDeparture':
          return DateRange;
        case 'firstTransitPortArrival':
          return DateRange;
        case 'firstTransitPortDeparture':
          return DateRange;
        case 'secondTransitPortArrival':
          return DateRange;
        case 'secondTransitPortDeparture':
          return DateRange;
        case 'dischargePortArrival':
          return DateRange;
        case 'customClearance':
          return DateRange;
        case 'warehouseArrival':
          return DateRange;
        case 'deliveryReady':
          return DateRange;
        case 'tags':
          return Tags;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        default:
          return Placeholder;
      }
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
