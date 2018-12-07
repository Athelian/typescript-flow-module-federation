// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseFilterMenu } from '../components';
import messages from './messages';

type Props = {
  parsedActiveFilters: Array<string>,
  toggleActiveFilter: (string, string) => void,
  parsedFilterToggles: Object,
  toggleFilterToggle: (string, string) => void,
  selectedFilterItem: string,
  changeSelectedFilterItem: string => void,
  selectedItems: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
};

const getSelectData = (
  selectedItems: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
  field: string
) => {
  const result = selectedItems.shipment[field] || [];
  return result;
};

export default function ShipmentFilterMenu({
  parsedActiveFilters,
  toggleActiveFilter,
  parsedFilterToggles,
  toggleFilterToggle,
  selectedFilterItem,
  changeSelectedFilterItem,
  selectedItems,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.shipment} />,
      icon: 'SHIPMENT',
      filters: [
        {
          name: 'forwarder',
          field: 'group.name',
          label: <FormattedMessage {...messages.forwarder} />,
          data: getSelectData(selectedItems, 'forwarder'),
        },
        {
          name: 'inCharge',
          field: 'group.name',
          label: <FormattedMessage {...messages.inCharge} />,
          data: getSelectData(selectedItems, 'inCharge'),
        },
        // temporary hide
        // { name: 'seaports', label: <FormattedMessage {...messages.seaports} />, data: [] },
        // { name: 'airports', label: <FormattedMessage {...messages.airports} />, data: [] },
        {
          name: 'cargoReady',
          label: <FormattedMessage {...messages.cargoReady} />,
          data: getSelectData(selectedItems, 'cargoReady'),
        },
        {
          name: 'loadPortDeparture',
          label: <FormattedMessage {...messages.loadPortDeparture} />,
          data: getSelectData(selectedItems, 'loadPortDeparture'),
        },
        {
          name: 'firstTransitPortArrival',
          label: <FormattedMessage {...messages.firstTransitPortArrival} />,
          data: getSelectData(selectedItems, 'firstTransitPortArrival'),
        },
        {
          name: 'firstTransitPortDeparture',
          label: <FormattedMessage {...messages.firstTransitPortDeparture} />,
          data: getSelectData(selectedItems, 'firstTransitPortDeparture'),
        },
        {
          name: 'secondTransitPortArrival',
          label: <FormattedMessage {...messages.secondTransitPortArrival} />,
          data: getSelectData(selectedItems, 'cargoReady'),
        },
        {
          name: 'secondTransitPortDeparture',
          label: <FormattedMessage {...messages.secondTransitPortDeparture} />,
          data: getSelectData(selectedItems, 'secondTransitPortDeparture'),
        },
        {
          name: 'dischargePortArrival',
          label: <FormattedMessage {...messages.dischargePortArrival} />,
          data: getSelectData(selectedItems, 'dischargePortArrival'),
        },
        {
          name: 'customClearance',
          label: <FormattedMessage {...messages.customClearance} />,
          data: getSelectData(selectedItems, 'customClearance'),
        },
        {
          name: 'warehouseArrival',
          label: <FormattedMessage {...messages.warehouseArrival} />,
          data: getSelectData(selectedItems, 'warehouseArrival'),
        },
        {
          name: 'deliveryReady',
          label: <FormattedMessage {...messages.deliveryReady} />,
          data: getSelectData(selectedItems, 'deliveryReady'),
        },
        { name: 'tags', label: <FormattedMessage {...messages.tags} />, data: [] },
        // temporary hide, not yet has this filter from graphql
        // { name: 'createdAt', label: <FormattedMessage {...messages.createdAt} />, data: [] },
        // { name: 'updatedAt', label: <FormattedMessage {...messages.updatedAt} />, data: [] },
      ],
    },
  ];

  const togglesMap = [
    { name: 'showActive', label: <FormattedMessage {...messages.showActive} />, icon: 'ACTIVE' },
    {
      name: 'showArchived',
      label: <FormattedMessage {...messages.showArchived} />,
      icon: 'ARCHIVE',
    },
  ];

  return (
    <BaseFilterMenu
      filtersMap={filtersMap}
      togglesMap={togglesMap}
      entityType="shipment"
      parsedActiveFilters={parsedActiveFilters}
      toggleActiveFilter={toggleActiveFilter}
      parsedFilterToggles={parsedFilterToggles}
      toggleFilterToggle={toggleFilterToggle}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
