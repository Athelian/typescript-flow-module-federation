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
  const result = selectedItems.order[field] || [];
  return result;
};

export default function OrderFilterMenu({
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
      label: <FormattedMessage {...messages.order} />,
      icon: 'ORDER',
      filters: [
        {
          name: 'ids',
          field: 'poNo',
          label: <FormattedMessage {...messages.order} />,
          data: getSelectData(selectedItems, 'ids'),
        },
        {
          name: 'exporter',
          field: 'group.name',
          label: <FormattedMessage {...messages.exporter} />,
          data: getSelectData(selectedItems, 'exporter'),
        },
        {
          name: 'inCharge',
          field: 'id',
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

  const togglesMap = [
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
  ];

  return (
    <BaseFilterMenu
      filtersMap={filtersMap}
      togglesMap={togglesMap}
      statusMap={statusMap}
      parsedStatusFilters={parsedStatusFilters}
      changeStatusFilter={changeStatusFilter}
      entityType="order"
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
