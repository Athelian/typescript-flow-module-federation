// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import OrderItemList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

function OrderItemModule(props: Props) {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
    { title: intl.formatMessage(messages.noSort), value: 'no' },
    { title: intl.formatMessage(messages.currencySort), value: 'currency' },
    { title: intl.formatMessage(messages.productNameSort), value: 'productName' },
    { title: intl.formatMessage(messages.productSerialSort), value: 'productSerial' },
    { title: intl.formatMessage(messages.productProviderNameSort), value: 'productProviderName' },
    { title: intl.formatMessage(messages.supplierNameSort), value: 'supplier' },
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
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <FilterToolBar
                icon="ORDER_ITEM"
                sortFields={sortFields}
                filtersAndSort={filterAndSort}
                onChange={onChangeFilter}
              />
            </NavBar>
          }
        >
          <OrderItemList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
}

export default injectIntl(OrderItemModule);
