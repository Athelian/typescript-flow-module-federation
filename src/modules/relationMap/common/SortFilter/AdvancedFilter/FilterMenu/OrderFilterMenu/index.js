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

export default function OrderFilterMenu({
  parsedActiveFilters,
  toggleActiveFilter,
  parsedFilterToggles,
  toggleFilterToggle,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const filtersMap = [
    {
      label: <FormattedMessage {...messages.order} />,
      icon: 'ORDER',
      filters: [
        { name: 'poNo', label: <FormattedMessage {...messages.poNo} />, data: ['Example'] },
        { name: 'exporter', label: <FormattedMessage {...messages.exporter} />, data: [] },
        { name: 'inCharge', label: <FormattedMessage {...messages.inCharge} />, data: [] },
        { name: 'tags', label: <FormattedMessage {...messages.tags} />, data: [] },
        { name: 'createdAt', label: <FormattedMessage {...messages.createdAt} />, data: [] },
        { name: 'updatedAt', label: <FormattedMessage {...messages.updatedAt} />, data: [] },
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
