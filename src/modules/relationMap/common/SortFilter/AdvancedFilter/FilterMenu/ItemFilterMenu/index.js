// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseFilterMenu } from '../components';
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
    {
      label: <FormattedMessage {...messages.product} />,
      icon: 'PRODUCT',
      filters: [{ name: 'tags', label: <FormattedMessage {...messages.tags} /> }],
    },
    {
      label: <FormattedMessage {...messages.endProduct} />,
      icon: 'PROVIDER',
      filters: [
        { name: 'exporter', label: <FormattedMessage {...messages.exporter} /> },
        { name: 'supplier', label: <FormattedMessage {...messages.supplier} /> },
        { name: 'origin', label: <FormattedMessage {...messages.origin} /> },
        { name: 'specifications', label: <FormattedMessage {...messages.specifications} /> },
        {
          name: 'productionLeadTime',
          label: <FormattedMessage {...messages.productionLeadTime} />,
        },
        { name: 'packaging', label: <FormattedMessage {...messages.packaging} /> },
      ],
    },
  ];

  return (
    <BaseFilterMenu
      filtersMap={filtersMap}
      entityType="item"
      activeFilters={activeFilters}
      toggleActiveFilter={toggleActiveFilter}
      selectedFilterItem={selectedFilterItem}
      changeSelectedFilterItem={changeSelectedFilterItem}
    />
  );
}
