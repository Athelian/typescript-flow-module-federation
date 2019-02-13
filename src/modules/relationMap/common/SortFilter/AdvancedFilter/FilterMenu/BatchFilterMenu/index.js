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
  onToggleSelect,
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
          name: 'totalVolume',
          label: <FormattedMessage {...messages.totalVolume} />,
          data: getSelectData(selectedItems, 'totalVolume'),
        },
        {
          name: 'tags',
          field: 'name',
          label: <FormattedMessage {...messages.tags} />,
          data: getSelectData(selectedItems, 'tags'),
        },
      ],
    },
  ];

  return (
    <BaseFilterMenu
      filtersMap={filtersMap}
      entityType="batch"
      parsedActiveFilters={parsedActiveFilters}
      toggleActiveFilter={toggleActiveFilter}
      parsedFilterToggles={parsedFilterToggles}
      toggleFilterToggle={toggleFilterToggle}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
      onToggleSelect={onToggleSelect}
    />
  );
}
