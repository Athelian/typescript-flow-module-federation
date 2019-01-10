// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import ListConfigProvider, { ListConfigConsumer } from 'components/ListConfig';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import OrderList from './list';
import messages from './messages';
import { ordersExportQuery } from './query';

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
    { title: intl.formatMessage(messages.poSort), value: 'poNo' },
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  return (
    <UIConsumer>
      {uiState => (
        <ListConfigProvider filterName="filterOrder" initFilter={getInitFilter()}>
          <Layout
            {...uiState}
            navBar={
              <ListConfigConsumer>
                {({ filterAndSort, onChangeFilter }) => (
                  <NavBar>
                    <FilterToolBar
                      icon="ORDER"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                    />
                    <ExportButton
                      type="Orders"
                      exportQuery={ordersExportQuery}
                      variables={{
                        filterBy: filterAndSort.filter,
                        sortBy: {
                          [filterAndSort.sort.field]: filterAndSort.sort.direction,
                        },
                      }}
                    />
                    <Link to="new">
                      <NewButton />
                    </Link>
                  </NavBar>
                )}
              </ListConfigConsumer>
            }
          >
            <ListConfigConsumer>
              {({ queryVariables }) => <OrderList {...queryVariables} />}
            </ListConfigConsumer>
          </Layout>
        </ListConfigProvider>
      )}
    </UIConsumer>
  );
}

export default injectIntl(OrderModule);
