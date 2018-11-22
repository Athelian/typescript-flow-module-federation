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

export default function BatchFilterMenu({
  activeFilters,
  toggleActiveFilter,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.batch} />,
      icon: 'BATCH',
      filters: [
        { name: 'deliveredAt', label: <FormattedMessage {...messages.deliveredAt} /> },
        { name: 'expiredAt', label: <FormattedMessage {...messages.expiredAt} /> },
        { name: 'producedAt', label: <FormattedMessage {...messages.producedAt} /> },
        { name: 'packaging', label: <FormattedMessage {...messages.packaging} /> },
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
      entityType="batch"
      activeFilters={activeFilters}
      toggleActiveFilter={toggleActiveFilter}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
