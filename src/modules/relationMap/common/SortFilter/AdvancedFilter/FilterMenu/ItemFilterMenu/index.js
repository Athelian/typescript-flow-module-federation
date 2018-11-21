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

export default function ItemFilterMenu({
  activeFilters,
  toggleActiveFilter,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.item} />,
      icon: 'ORDER_ITEM',
      filters: [
        { name: 'price', label: <FormattedMessage {...messages.price} /> },
        { name: 'createdAt', label: <FormattedMessage {...messages.createdAt} /> },
        { name: 'updatedAt', label: <FormattedMessage {...messages.updatedAt} /> },
      ],
    },
  ];

  return (
    <FilterMenu
      filtersMap={filtersMap}
      activeFilters={activeFilters}
      toggleActiveFilter={toggleActiveFilter}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
