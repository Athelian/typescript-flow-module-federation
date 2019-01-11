// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseFilterMenu } from '../components';
import messages from './messages';

type Props = {
  parsedActiveFilters: Array<string>,
  parsedStatusFilters: any,
  changeStatusFilter: Function,
  toggleActiveFilter: (string, string) => void,
  parsedFilterToggles: Object,
  toggleFilterToggle: (string, string) => void,
  selectedFilterItem: string,
  changeSelectedFilterItem: string => void,
  onToggleSelect: Function,
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
  parsedStatusFilters,
  changeStatusFilter,
  toggleActiveFilter,
  parsedFilterToggles,
  toggleFilterToggle,
  selectedFilterItem,
  changeSelectedFilterItem,
  selectedItems,
  onToggleSelect,
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
          name: 'warehouse',
          field: 'name',
          label: <FormattedMessage id="modules.relationMap.warehouse" defaultMessage="WAREHOUSE" />,
          data: getSelectData(selectedItems, 'warehouse'),
        },
        // {
        //   name: 'inCharge',
        //   field: 'id',
        //   label: <FormattedMessage {...messages.inCharge} />,
        //   data: getSelectData(selectedItems, 'inCharge'),
        // },
        {
          name: 'seaports',
          label: <FormattedMessage {...messages.seaports} />,
          data: getSelectData(selectedItems, 'seaports'),
        },
        {
          name: 'airports',
          label: <FormattedMessage {...messages.airports} />,
          data: getSelectData(selectedItems, 'airports'),
        },
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
        {
          name: 'tags',
          field: 'name',
          label: <FormattedMessage {...messages.tags} />,
          data: getSelectData(selectedItems, 'tags'),
        },
        {
          name: 'createdAt',
          label: <FormattedMessage {...messages.createdAt} />,
          data: getSelectData(selectedItems, 'createdAt'),
        },
        {
          name: 'updatedAt',
          label: <FormattedMessage {...messages.updatedAt} />,
          data: getSelectData(selectedItems, 'updatedAt'),
        },
      ],
    },
  ];

  const statusMap = [
    {
      name: 'active',
      label: <FormattedMessage id="modules.relationMap.active" defaultMessage="ACTIVE" />,
      field: 'archived',
      value: false,
    },
    {
      name: 'archived',
      label: <FormattedMessage id="modules.relationMap.archived" defaultMessage="ARCHIVED" />,
      field: 'archived',
      value: true,
    },
    {
      name: 'all',
      label: <FormattedMessage id="modules.relationMap.all" defaultMessage="ALL" />,
      field: 'archived',
      value: null,
    },
  ];

  const togglesMap = [];

  return (
    <BaseFilterMenu
      filtersMap={filtersMap}
      togglesMap={togglesMap}
      entityType="shipment"
      parsedActiveFilters={parsedActiveFilters}
      statusMap={statusMap}
      parsedStatusFilters={parsedStatusFilters}
      changeStatusFilter={changeStatusFilter}
      toggleActiveFilter={toggleActiveFilter}
      parsedFilterToggles={parsedFilterToggles}
      toggleFilterToggle={toggleFilterToggle}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
      onToggleSelect={onToggleSelect}
    />
  );
}
