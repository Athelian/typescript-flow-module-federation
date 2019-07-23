// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import { Content } from 'components/Layout';
import { NavBar } from 'components/NavBar';
import OrderItemList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

function OrderItemModule(props: Props) {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.no), value: 'no' },
    { title: intl.formatMessage(messages.currency), value: 'currency' },
    { title: intl.formatMessage(messages.productName), value: 'productName' },
    { title: intl.formatMessage(messages.productSerial), value: 'productSerial' },
    { title: intl.formatMessage(messages.productProviderName), value: 'productProviderName' },
    { title: intl.formatMessage(messages.supplierName), value: 'supplierName' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    {
      filter: {
        query: '',
        archived: false,
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
      perPage: 10,
      page: 1,
    },
    'filterOrderItem'
  );

  return (
    <Content>
      <NavBar>
        <FilterToolBar
          icon="ORDER_ITEM"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
          canArchive
          canSort
          canSearch
        />
      </NavBar>
      <OrderItemList {...queryVariables} />
    </Content>
  );
}

export default injectIntl(OrderItemModule);
