// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import UserAvatar from 'components/UserAvatar';
import { Display } from 'components/Form';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { orderListQuery } from 'modules/order/list/query';
import { partnerListQuery } from 'providers/PartnerList/query';
import { usersQuery } from 'graphql/staff/query';
import { warehouseListQuery } from 'providers/WarehouseListProvider/query';
import {
  DateRange,
  DayRange,
  MiniSelector,
  MiniSelectorItem,
  Origin,
  Packaging,
  TotalVolumeRangeInput,
  Ports,
  PriceRange,
  Specifications,
  Tags,
} from './components';
import { FilterInputAreaWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
  selectedItems: any,
  dispatch: (action: { type: string, payload: Object }) => void,
};

const getFilterInputArea = ({
  selectedEntityType,
  selectedFilterItem,
  selectedItems,
  onToggleSelect,
}: {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
  selectedItems: any,
  onToggleSelect: Function,
}) => {
  switch (selectedEntityType) {
    case 'order': {
      switch (selectedFilterItem) {
        case 'ids':
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
                  key={`order-${item.id}`}
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
                  selected={selectedItems.map(selectItem => selectItem.id).includes(item.id)}
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
              query: usersQuery,
              filterBy: {
                query: '',
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.map(selectItem => selectItem.email).includes(item.email)}
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
              fromDate={selectedItems.after}
              toDate={selectedItems.before}
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
          return () => (
            <PriceRange
              currency={selectedItems.currency}
              min={selectedItems.min}
              max={selectedItems.max}
              onChangeCurrency={currency => onToggleSelect(currency, 'currency')}
              onChangeMin={min => onToggleSelect(min, 'min')}
              onChangeMax={max => onToggleSelect(max, 'max')}
            />
          );
        case 'createdAt':
        case 'updatedAt':
          return () => (
            <DateRange
              fromDate={selectedItems.after}
              toDate={selectedItems.before}
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
          return () => (
            <Packaging
              packageLength={selectedItems.packageLength}
              packageWidth={selectedItems.packageWidth}
              packageHeight={selectedItems.packageHeight}
              packageVolume={selectedItems.packageVolume}
              packageWeight={selectedItems.packageWeight}
              onChangePackageLength={length => onToggleSelect(length, 'packageLength')}
              onChangePackageWidth={width => onToggleSelect(width, 'packageWidth')}
              onChangePackageHeight={height => onToggleSelect(height, 'packageHeight')}
              onChangePackageVolume={volume => onToggleSelect(volume, 'packageVolume')}
              onChangePackageWeight={weight => onToggleSelect(weight, 'packageWeight')}
            />
          );
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
              fromDate={selectedItems.after}
              toDate={selectedItems.before}
              onChangeFromDate={e => onToggleSelect(e.target.value, 'after')}
              onChangeToDate={e => onToggleSelect(e.target.value, 'before')}
            />
          );
        case 'totalVolume':
          return () => (
            <TotalVolumeRangeInput
              value={selectedItems.value}
              onChange={value => onToggleSelect(value, 'value')}
            />
          );
        case 'packaging':
          return () => (
            <Packaging
              packageLength={selectedItems.packageLength}
              packageWidth={selectedItems.packageWidth}
              packageHeight={selectedItems.packageHeight}
              packageVolume={selectedItems.packageVolume}
              packageWeight={selectedItems.packageWeight}
              onChangePackageLength={length => onToggleSelect(length, 'packageLength')}
              onChangePackageWidth={width => onToggleSelect(width, 'packageWidth')}
              onChangePackageHeight={height => onToggleSelect(height, 'packageHeight')}
              onChangePackageVolume={volume => onToggleSelect(volume, 'packageVolume')}
              onChangePackageWeight={weight => onToggleSelect(weight, 'packageWeight')}
            />
          );
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
          return () => (
            <DateRange
              fromDate={selectedItems.after}
              toDate={selectedItems.before}
              onChangeFromDate={e => onToggleSelect(e.target.value, 'after')}
              onChangeToDate={e => onToggleSelect(e.target.value, 'before')}
            />
          );
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
                  selected={selectedItems.map(selectItem => selectItem.id).includes(item.id)}
                  key={item.id}
                >
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'warehouse':
          return () =>
            MiniSelector({
              hideToggles: true,
              entityType: 'warehouses',
              query: warehouseListQuery,
              filterBy: {
                query: '',
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  key={item.id}
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.map(selectItem => selectItem.id).includes(item.id)}
                >
                  <Display align="left">{item.name}</Display>
                </MiniSelectorItem>
              ),
            });
        case 'inCharge':
          return () =>
            MiniSelector({
              entityType: 'users',
              query: usersQuery,
              filterBy: {
                query: '',
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem
                  onClick={() => onToggleSelect(item)}
                  selectable
                  selected={selectedItems.map(selectItem => selectItem.email).includes(item.email)}
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
          return () => (
            <Ports
              portType="Seaport"
              loadPorts={selectedItems.loadPorts}
              dischargePorts={selectedItems.dischargePorts}
              firstTransitPorts={selectedItems.firstTransitPorts}
              secondTransitPorts={selectedItems.secondTransitPorts}
              onChangeLoadPorts={ports => onToggleSelect(ports, 'loadPorts')}
              onChangeDischargePorts={ports => onToggleSelect(ports, 'dischargePorts')}
              onChangeFirstTransitPorts={ports => onToggleSelect(ports, 'firstTransitPorts')}
              onChangeSecondTransitPorts={ports => onToggleSelect(ports, 'secondTransitPorts')}
            />
          );
        case 'airports':
          return () => (
            <Ports
              portType="Airport"
              loadPorts={selectedItems.loadPorts}
              dischargePorts={selectedItems.dischargePorts}
              firstTransitPorts={selectedItems.firstTransitPorts}
              secondTransitPorts={selectedItems.secondTransitPorts}
              onChangeLoadPorts={ports => onToggleSelect(ports, 'loadPorts')}
              onChangeDischargePorts={ports => onToggleSelect(ports, 'dischargePorts')}
              onChangeFirstTransitPorts={ports => onToggleSelect(ports, 'firstTransitPorts')}
              onChangeSecondTransitPorts={ports => onToggleSelect(ports, 'secondTransitPorts')}
            />
          );
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
              fromDate={selectedItems.after}
              toDate={selectedItems.before}
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
          return () => (
            <DateRange
              fromDate={selectedItems.after}
              toDate={selectedItems.before}
              onChangeFromDate={e => onToggleSelect(e.target.value, 'after')}
              onChangeToDate={e => onToggleSelect(e.target.value, 'before')}
            />
          );
        default:
          return () => <div />;
      }
    default:
      return () => <div />;
  }
};

function FilterInputArea({
  selectedEntityType,
  selectedFilterItem,
  selectedItems,
  dispatch,
}: Props) {
  const SelectedFilterInputArea = getFilterInputArea({
    selectedEntityType,
    selectedFilterItem,
    selectedItems,
    onToggleSelect: (selectItem: any, field?: string) =>
      dispatch({
        type: field ? 'SET_SELECT_ITEM' : 'TOGGLE_SELECT_ITEM',
        payload: {
          selectItem,
          ...(field ? { field } : {}),
        },
      }),
  });

  return <div className={FilterInputAreaWrapperStyle}>{SelectedFilterInputArea()}</div>;
}

export default FilterInputArea;
