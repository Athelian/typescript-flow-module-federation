// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import UserAvatar from 'components/UserAvatar';
import { Display } from 'components/Form';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { orderListQuery } from 'modules/order/list/query';
import { partnerListQuery } from 'providers/PartnerList/query';
import { userListQuery } from 'providers/UserList/query';
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
  selectedItems: any, // Array<Object> | Object,
  onToggleSelect: Function,
};

const getFilterInputArea = ({
  selectedEntityType,
  selectedFilterItem,
  selectedItems,
  onToggleSelect,
}: Props) => {
  switch (selectedEntityType) {
    case 'order': {
      switch (selectedFilterItem) {
        case 'poNo':
          return () =>
            MiniSelector({
              entityType: 'orders',
              hideToggles: false,
              query: orderListQuery,
              filterBy: {
                query: '',
                archived: null,
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                  key={item.id}
                  isArchived={item.archived}
                >
                  <Display align="left">{item.poNo}</Display>
                </MiniSelectorItem>
              ),
            });
        case 'exporter':
          return () =>
            MiniSelector({
              entityType: 'viewer.user.group.partners',
              query: partnerListQuery,
              filterBy: {
                query: '',
                types: ['Exporter'],
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.includes(item)}
                  key={item.id}
                >
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'inCharge':
          return () =>
            MiniSelector({
              entityType: 'users',
              query: userListQuery,
              filterBy: {
                query: '',
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.includes(item)}
                  key={item.id}
                >
                  <UserAvatar
                    firstName={item.firstName}
                    lastName={item.lastName}
                    height="20px"
                    width="20px"
                  />
                  <Display align="left">
                    <FormattedName firstName={item.firstName} lastName={item.lastName} />
                  </Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'tags':
          return () => (
            <Tags
              values={selectedItems}
              tagType="Order"
              onChange={(name, tags) => onToggleSelect(tags)}
            />
          );
        case 'createdAt':
        case 'updatedAt':
          return () => (
            <DateRange
              fromDate={new Date(selectedItems.after)}
              toDate={new Date(selectedItems.before)}
              onChangeFromDate={e => onToggleSelect(e.target.value, 'after')}
              onChangeToDate={e => onToggleSelect(e.target.value, 'before')}
            />
          );
        default:
          return () => <div />;
      }
    }
    case 'item':
      switch (selectedFilterItem) {
        case 'price':
          return PriceRange;
        case 'createdAt':
        case 'updatedAt':
          return () => (
            <DateRange
              fromDate={new Date(selectedItems.after)}
              toDate={new Date(selectedItems.before)}
              onChangeFromDate={e => onToggleSelect(e.target.value, 'after')}
              onChangeToDate={e => onToggleSelect(e.target.value, 'before')}
            />
          );
        case 'tags':
          return () => (
            <Tags
              values={selectedItems}
              tagType="Product"
              onChange={(name, tags) => onToggleSelect(tags)}
            />
          );
        case 'exporter':
          return () =>
            MiniSelector({
              entityType: 'viewer.user.group.partners',
              query: partnerListQuery,
              filterBy: {
                query: '',
                types: ['Exporter'],
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.includes(item)}
                  key={item.id}
                >
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'supplier':
          return () =>
            MiniSelector({
              entityType: 'viewer.user.group.partners',
              query: partnerListQuery,
              filterBy: {
                query: '',
                types: ['Supplier'],
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.includes(item)}
                  key={item.id}
                >
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'origin':
          return () => (
            <Origin values={selectedItems} onChange={origins => onToggleSelect(origins)} />
          );
        case 'specifications':
          return Specifications;
        case 'productionLeadTime':
          return DayRange;
        case 'packaging':
          return Packaging;
        default:
          return () => <div />;
      }
    case 'batch':
      switch (selectedFilterItem) {
        case 'deliveredAt':
        case 'expiredAt':
        case 'producedAt':
          return () => (
            <DateRange
              fromDate={new Date(selectedItems.after)}
              toDate={new Date(selectedItems.before)}
              onChangeFromDate={e => onToggleSelect(e.target.value, 'after')}
              onChangeToDate={e => onToggleSelect(e.target.value, 'before')}
            />
          );
        case 'packaging':
          return Packaging;
        case 'tags':
          return () => (
            <Tags
              values={selectedItems}
              tagType="Batch"
              onChange={(name, tags) => onToggleSelect(tags)}
            />
          );
        case 'createdAt':
        case 'updatedAt':
        default:
          return () => <div />;
      }
    case 'shipment':
      switch (selectedFilterItem) {
        case 'forwarder':
          return () =>
            MiniSelector({
              entityType: 'viewer.user.group.partners',
              query: partnerListQuery,
              filterBy: {
                query: '',
                types: ['Forwarder'],
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.includes(item)}
                  key={item.id}
                >
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'inCharge':
          return () =>
            MiniSelector({
              entityType: 'users',
              query: userListQuery,
              filterBy: {
                query: '',
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.includes(item)}
                  key={item.id}
                >
                  <UserAvatar
                    firstName={item.firstName}
                    lastName={item.lastName}
                    height="20px"
                    width="20px"
                  />
                  <Display align="left">
                    <FormattedName firstName={item.firstName} lastName={item.lastName} />
                  </Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'seaports':
          return () => Ports({ portType: 'Seaport' });
        case 'airports':
          return () => Ports({ portType: 'Airport' });
        case 'cargoReady':
        case 'loadPortDeparture':
        case 'firstTransitPortArrival':
        case 'firstTransitPortDeparture':
        case 'secondTransitPortArrival':
        case 'secondTransitPortDeparture':
        case 'dischargePortArrival':
        case 'customClearance':
        case 'warehouseArrival':
        case 'deliveryReady':
          return () => (
            <DateRange
              fromDate={new Date(selectedItems.after)}
              toDate={new Date(selectedItems.before)}
              onChangeFromDate={e => onToggleSelect(e.target.value, 'after')}
              onChangeToDate={e => onToggleSelect(e.target.value, 'before')}
            />
          );
        case 'tags':
          return () => (
            <Tags
              values={selectedItems}
              tagType="Shipment"
              onChange={(name, tags) => onToggleSelect(tags)}
            />
          );
        case 'createdAt':
        case 'updatedAt':
        default:
          return () => <div />;
      }
    default:
      return () => <div />;
  }
};

export default function FilterInputArea({
  selectedEntityType,
  selectedFilterItem,
  selectedItems,
  onToggleSelect,
}: Props) {
  const SelectedFilterInputArea = getFilterInputArea({
    selectedEntityType,
    selectedFilterItem,
    selectedItems,
    onToggleSelect,
  });

  return <div className={FilterInputAreaWrapperStyle}>{SelectedFilterInputArea()}</div>;
}
