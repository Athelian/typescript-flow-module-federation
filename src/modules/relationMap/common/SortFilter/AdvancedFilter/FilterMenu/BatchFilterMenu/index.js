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

export default function BatchFilterMenu({
  parsedActiveFilters,
  toggleActiveFilter,
  parsedFilterToggles,
  toggleFilterToggle,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.batch} />,
      icon: 'BATCH',
      filters: [
        { name: 'deliveredAt', label: <FormattedMessage {...messages.deliveredAt} />, data: [] },
        { name: 'expiredAt', label: <FormattedMessage {...messages.expiredAt} />, data: [] },
        { name: 'producedAt', label: <FormattedMessage {...messages.producedAt} />, data: [] },
        { name: 'packaging', label: <FormattedMessage {...messages.packaging} />, data: [] },
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
