// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { orderListQuery } from 'modules/order/list/query';
import {
  DateRange,
  DayRange,
  MiniSelector,
  MiniSelectorItem,
  Origin,
  Packaging,
  Ports,
  PriceRange,
  Specifications,
  Tags,
} from './components';
import { FilterInputAreaWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
};

const getFilterInputArea = (selectedEntityType: EntityTypes, selectedFilterItem: string) => {
  switch (selectedEntityType) {
    case 'order': {
      switch (selectedFilterItem) {
        case 'poNo':
          return () =>
            MiniSelector({
              entityType: 'orders',
              query: orderListQuery,
              filters: {
                query: '',
                archived: null,
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem key={item.id} isArchived={item.archived}>
                  {item.poNo}
                </MiniSelectorItem>
              ),
            });
        case 'exporter':
          return MiniSelector;
        case 'inCharge':
          return MiniSelector;
        case 'tags':
          return Tags;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        default:
          return null;
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
          return MiniSelector;
        case 'supplier':
          return MiniSelector;
        case 'origin':
          return Origin;
        case 'specifications':
          return Specifications;
        case 'productionLeadTime':
          return DayRange;
        case 'packaging':
          return Packaging;
        default:
          return null;
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
          return Packaging;
        case 'tags':
          return Tags;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        default:
          return null;
      }
    case 'shipment':
      switch (selectedFilterItem) {
        case 'forwarder':
          return MiniSelector;
        case 'inCharge':
          return MiniSelector;
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
          return null;
      }
    default:
      return null;
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
