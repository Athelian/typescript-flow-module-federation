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
  const result = selectedItems.batch[field] || [];
  return result;
};

export default function BatchFilterMenu({
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
      label: <FormattedMessage {...messages.batch} />,
      icon: 'BATCH',
      filters: [
        {
          name: 'deliveredAt',
          label: <FormattedMessage {...messages.deliveredAt} />,
          data: getSelectData(selectedItems, 'deliveredAt'),
        },
        {
          name: 'expiredAt',
          label: <FormattedMessage {...messages.expiredAt} />,
          data: getSelectData(selectedItems, 'expiredAt'),
        },
        {
          name: 'producedAt',
          label: <FormattedMessage {...messages.producedAt} />,
          data: getSelectData(selectedItems, 'producedAt'),
        },
        // { name: 'packaging', label: <FormattedMessage {...messages.packaging} />, data: [] },
        { name: 'tags', label: <FormattedMessage {...messages.tags} />, data: [] },
        // { name: 'createdAt', label: <FormattedMessage {...messages.createdAt} />, data: [] },
        // { name: 'updatedAt', label: <FormattedMessage {...messages.updatedAt} />, data: [] },
      ],
    },
  ];

  const togglesMap = [
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
      entityType="batch"
      parsedActiveFilters={parsedActiveFilters}
      toggleActiveFilter={toggleActiveFilter}
      parsedFilterToggles={parsedFilterToggles}
      toggleFilterToggle={toggleFilterToggle}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
