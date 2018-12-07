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
  const result = selectedItems.order[field] || [];
  return result;
};

export default function OrderFilterMenu({
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
      label: <FormattedMessage {...messages.order} />,
      icon: 'ORDER',
      filters: [
        {
          name: 'poNo',
          field: 'poNo',
          label: <FormattedMessage {...messages.poNo} />,
          data: getSelectData(selectedItems, 'poNo'),
        },
        {
          name: 'exporter',
          field: 'group.name',
          label: <FormattedMessage {...messages.exporter} />,
          data: getSelectData(selectedItems, 'exporter'),
        },
        {
          name: 'inCharge',
          field: 'firstName',
          label: <FormattedMessage {...messages.inCharge} />,
          data: getSelectData(selectedItems, 'inCharge'),
        },
        {
          name: 'tags',
          field: 'name',
          label: <FormattedMessage {...messages.tags} />,
          data: getSelectData(selectedItems, 'tags'),
        },
        {
          name: 'createdAt',
          field: 'createdAt',
          label: <FormattedMessage {...messages.createdAt} />,
          data: getSelectData(selectedItems, 'createdAt'),
        },
        {
          name: 'updatedAt',
          field: 'updatedAt',
          label: <FormattedMessage {...messages.updatedAt} />,
          data: getSelectData(selectedItems, 'updatedAt'),
        },
      ],
    },
  ];

  const togglesMap = [
    // temporary hide
    // {
    //   name: 'completelyBatched',
    //   label: <FormattedMessage {...messages.completelyBatched} />,
    //   icon: 'BATCH',
    // },
    // {
    //   name: 'completelyShipped',
    //   label: <FormattedMessage {...messages.completelyShipped} />,
    //   icon: 'SHIPMENT',
    // },
    // { name: 'showActive', label: <FormattedMessage {...messages.showActive} />, icon: 'ACTIVE' },
    // {
    //   name: 'showArchived',
    //   label: <FormattedMessage {...messages.showArchived} />,
    //   icon: 'ARCHIVE',
    // },
  ];

  return (
    <BaseFilterMenu
      filtersMap={filtersMap}
      togglesMap={togglesMap}
      entityType="order"
      parsedActiveFilters={parsedActiveFilters}
      toggleActiveFilter={toggleActiveFilter}
      parsedFilterToggles={parsedFilterToggles}
      toggleFilterToggle={toggleFilterToggle}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
