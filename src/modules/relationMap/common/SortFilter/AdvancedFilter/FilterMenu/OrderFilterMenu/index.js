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

export default function OrderFilterMenu({
  activeFilters,
  toggleActiveFilter,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.order} />,
      icon: 'ORDER',
      filters: [
        { name: 'poNo', label: <FormattedMessage {...messages.poNo} /> },
        { name: 'exporter', label: <FormattedMessage {...messages.exporter} /> },
        { name: 'inCharge', label: <FormattedMessage {...messages.inCharge} /> },
        { name: 'tags', label: <FormattedMessage {...messages.tags} /> },
        { name: 'createdAt', label: <FormattedMessage {...messages.createdAt} /> },
        { name: 'updatedAt', label: <FormattedMessage {...messages.updatedAt} /> },
      ],
    },
  ];

  const togglesMap = [
    {
      name: 'completelyBatched',
      label: <FormattedMessage {...messages.completelyBatched} />,
      icon: 'BATCH',
    },
    {
      name: 'completelyShipped',
      label: <FormattedMessage {...messages.completelyShipped} />,
      icon: 'SHIPMENT',
    },
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
      entityType="order"
      activeFilters={activeFilters}
      toggleActiveFilter={toggleActiveFilter}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
