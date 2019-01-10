// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseFilterMenu } from '../components';
import messages from './messages';

type Props = {
  parsedActiveFilters: Array<string>,
  parsedRadioFilters: any,
  changeRadioFilter: Function,
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
  parsedRadioFilters,
  changeRadioFilter,
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

  const archivedUI = [
    {
      name: 'all',
      label: <FormattedMessage id="modules.relationMap.all" defaultMessage="ALL" />,
      field: 'archived',
      value: null,
    },
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
  ];

  const togglesMap = [];

  const completelyBatchedUI = [
    {
      name: 'all',
      label: <FormattedMessage id="modules.relationMap.all" defaultMessage="ALL" />,
      field: 'completelyBatched',
      value: null,
    },
    {
      name: 'completely',
      label: (
        <FormattedMessage
          id="modules.relationMap.notFullyBatched"
          defaultMessage="NOT FULLY BATCHED"
        />
      ),
      field: 'completelyBatched',
      value: false,
    },
  ];

  const completelyShippedUI = [
    {
      name: 'all',
      label: <FormattedMessage id="modules.relationMap.all" defaultMessage="ALL" />,
      field: 'completelyShipped',
      value: null,
    },
    {
      name: 'completely',
      label: (
        <FormattedMessage
          id="modules.relationMap.notFullyShipped"
          defaultMessage="NOT FULLY SHIPPED"
        />
      ),
      field: 'completelyShipped',
      value: false,
    },
  ];

  return (
    <BaseFilterMenu
      filtersMap={filtersMap}
      togglesMap={togglesMap}
      archivedUI={archivedUI}
      completelyBatchedUI={completelyBatchedUI}
      completelyShippedUI={completelyShippedUI}
      parsedRadioFilters={parsedRadioFilters}
      changeRadioFilter={changeRadioFilter}
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
