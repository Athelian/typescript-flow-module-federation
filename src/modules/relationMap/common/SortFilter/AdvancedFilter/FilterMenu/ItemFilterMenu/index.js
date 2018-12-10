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
  const result = selectedItems.item[field] || [];
  return result;
};

export default function ItemFilterMenu({
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
      label: <FormattedMessage {...messages.item} />,
      icon: 'ORDER_ITEM',
      filters: [
        { name: 'price', label: <FormattedMessage {...messages.price} />, data: [] },
        {
          name: 'createdAt',
          label: <FormattedMessage {...messages.createdAt} />,
          data: getSelectData(selectedItems, 'createdAt'),
        },
        {
          name: 'updatedAt',
          label: <FormattedMessage {...messages.updatedAt} />,
          data: getSelectData(selectedItems, 'updatedAt'),
        },
      ],
    },
    {
      label: <FormattedMessage {...messages.product} />,
      icon: 'PRODUCT',
      filters: [
        {
          name: 'tags',
          field: 'name',
          label: <FormattedMessage {...messages.tags} />,
          data: getSelectData(selectedItems, 'tags'),
        },
      ],
    },
    {
      label: <FormattedMessage {...messages.endProduct} />,
      icon: 'PROVIDER',
      filters: [
        {
          name: 'exporter',
          field: 'group.name',
          label: <FormattedMessage {...messages.exporter} />,
          data: getSelectData(selectedItems, 'exporter'),
        },
        {
          name: 'supplier',
          field: 'group.name',
          label: <FormattedMessage {...messages.supplier} />,
          data: getSelectData(selectedItems, 'supplier'),
        },
        {
          name: 'origin',
          field: 'name',
          label: <FormattedMessage {...messages.origin} />,
          data: getSelectData(selectedItems, 'origin').filter(item => item.name !== ''),
        },
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
