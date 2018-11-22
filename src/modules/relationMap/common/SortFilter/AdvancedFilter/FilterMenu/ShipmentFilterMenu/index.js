// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FilterMenu } from '../components';
import messages from './messages';

type Props = {
  activeFilters: Array<string>,
  toggleActiveFilter: (string, string) => void,
  selectedFilterItem: string,
  changeSelectedFilterItem: string => void,
};

export default function ShipmentFilterMenu({
  activeFilters,
  toggleActiveFilter,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.shipment} />,
      icon: 'SHIPMENT',
      filters: [
        { name: 'forwarder', label: <FormattedMessage {...messages.forwarder} /> },
        { name: 'inCharge', label: <FormattedMessage {...messages.inCharge} /> },
        { name: 'ports', label: <FormattedMessage {...messages.ports} /> },
        { name: 'cargoReady', label: <FormattedMessage {...messages.cargoReady} /> },
        { name: 'loadPortDeparture', label: <FormattedMessage {...messages.loadPortDeparture} /> },
        {
          name: 'firstTransitPortArrival',
          label: <FormattedMessage {...messages.firstTransitPortArrival} />,
        },
        {
          name: 'firstTransitPortDeparture',
          label: <FormattedMessage {...messages.firstTransitPortDeparture} />,
        },
        {
          name: 'secondTransitPortArrival',
          label: <FormattedMessage {...messages.secondTransitPortArrival} />,
        },
        {
          name: 'secondTransitPortDeparture',
          label: <FormattedMessage {...messages.secondTransitPortDeparture} />,
        },
        {
          name: 'dischargePortArrival',
          label: <FormattedMessage {...messages.dischargePortArrival} />,
        },
        { name: 'customClearance', label: <FormattedMessage {...messages.customClearance} /> },
        { name: 'warehouseArrival', label: <FormattedMessage {...messages.warehouseArrival} /> },
        { name: 'deliveryReady', label: <FormattedMessage {...messages.deliveryReady} /> },
        { name: 'tags', label: <FormattedMessage {...messages.tags} /> },
        { name: 'createdAt', label: <FormattedMessage {...messages.createdAt} /> },
        { name: 'updatedAt', label: <FormattedMessage {...messages.updatedAt} /> },
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
    <FilterMenu
      filtersMap={filtersMap}
      togglesMap={togglesMap}
      entityType="shipment"
      activeFilters={activeFilters}
      toggleActiveFilter={toggleActiveFilter}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
