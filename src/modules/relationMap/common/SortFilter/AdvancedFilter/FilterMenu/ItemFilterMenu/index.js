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

export default function ItemFilterMenu({
  parsedActiveFilters,
  toggleActiveFilter,
  parsedFilterToggles,
  toggleFilterToggle,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.item} />,
      icon: 'ORDER_ITEM',
      filters: [
        { name: 'price', label: <FormattedMessage {...messages.price} />, data: [] },
        { name: 'createdAt', label: <FormattedMessage {...messages.createdAt} />, data: [] },
        { name: 'updatedAt', label: <FormattedMessage {...messages.updatedAt} />, data: [] },
      ],
    },
    {
      label: <FormattedMessage {...messages.product} />,
      icon: 'PRODUCT',
      filters: [{ name: 'tags', label: <FormattedMessage {...messages.tags} />, data: [] }],
    },
    {
      label: <FormattedMessage {...messages.endProduct} />,
      icon: 'PROVIDER',
      filters: [
        { name: 'exporter', label: <FormattedMessage {...messages.exporter} />, data: [] },
        { name: 'supplier', label: <FormattedMessage {...messages.supplier} />, data: [] },
        { name: 'origin', label: <FormattedMessage {...messages.origin} />, data: [] },
        {
          name: 'specifications',
          label: <FormattedMessage {...messages.specifications} />,
          data: [],
        },
        {
          name: 'productionLeadTime',
          label: <FormattedMessage {...messages.productionLeadTime} />,
          data: [],
        },
        { name: 'packaging', label: <FormattedMessage {...messages.packaging} />, data: [] },
      ],
    },
  ];

  return (
    <BaseFilterMenu
      filtersMap={filtersMap}
      entityType="item"
      parsedActiveFilters={parsedActiveFilters}
      toggleActiveFilter={toggleActiveFilter}
      parsedFilterToggles={parsedFilterToggles}
      toggleFilterToggle={toggleFilterToggle}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
