// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import useListConfig from 'hooks/useListConfig';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
// import OrderList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filter: {
    query: string,
    archived: boolean,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
  page: number,
};

const getInitFilter = () => {
  const state: State = {
    viewType: 'grid',
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
  };
  return state;
};
function OrderModule(props: Props) {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.warehouseName), value: 'warehouseName' },
    {
      title: intl.formatMessage(messages.warehouseArrivalActualDate),
      value: 'warehouseArrivalActualDate',
    },
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
  ];
  const { filterAndSort, onChangeFilter } = useListConfig(getInitFilter(), 'filterContainer');
  return (
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <FilterToolBar
                icon="CONTAINER"
                sortFields={sortFields}
                filtersAndSort={filterAndSort}
                onChange={onChangeFilter}
              />
            </NavBar>
          }
        >
          <div>Container List</div>
        </Layout>
      )}
    </UIConsumer>
  );
}

export default injectIntl(OrderModule);
