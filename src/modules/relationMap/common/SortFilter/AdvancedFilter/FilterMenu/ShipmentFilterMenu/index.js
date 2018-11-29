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
};

export default function ShipmentFilterMenu({
  parsedActiveFilters,
  toggleActiveFilter,
  parsedFilterToggles,
  toggleFilterToggle,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.shipment} />,
      icon: 'SHIPMENT',
      filters: [
        { name: 'forwarder', label: <FormattedMessage {...messages.forwarder} />, data: [] },
        { name: 'inCharge', label: <FormattedMessage {...messages.inCharge} />, data: [] },
        { name: 'seaports', label: <FormattedMessage {...messages.seaports} />, data: [] },
        { name: 'airports', label: <FormattedMessage {...messages.airports} />, data: [] },
        { name: 'cargoReady', label: <FormattedMessage {...messages.cargoReady} />, data: [] },
        {
          name: 'loadPortDeparture',
          label: <FormattedMessage {...messages.loadPortDeparture} />,
          data: [],
        },
        {
          name: 'firstTransitPortArrival',
          label: <FormattedMessage {...messages.firstTransitPortArrival} />,
          data: [],
        },
        {
          name: 'firstTransitPortDeparture',
          label: <FormattedMessage {...messages.firstTransitPortDeparture} />,
          data: [],
        },
        {
          name: 'secondTransitPortArrival',
          label: <FormattedMessage {...messages.secondTransitPortArrival} />,
          data: [],
        },
        {
          name: 'secondTransitPortDeparture',
          label: <FormattedMessage {...messages.secondTransitPortDeparture} />,
          data: [],
        },
        {
          name: 'dischargePortArrival',
          label: <FormattedMessage {...messages.dischargePortArrival} />,
          data: [],
        },
        {
          name: 'customClearance',
          label: <FormattedMessage {...messages.customClearance} />,
          data: [],
        },
        {
          name: 'warehouseArrival',
          label: <FormattedMessage {...messages.warehouseArrival} />,
          data: [],
        },
        {
          name: 'deliveryReady',
          label: <FormattedMessage {...messages.deliveryReady} />,
          data: [],
        },
        { name: 'tags', label: <FormattedMessage {...messages.tags} />, data: [] },
        { name: 'createdAt', label: <FormattedMessage {...messages.createdAt} />, data: [] },
        { name: 'updatedAt', label: <FormattedMessage {...messages.updatedAt} />, data: [] },
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
