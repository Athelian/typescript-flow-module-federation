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
import { NewButton } from 'components/Buttons';
import WarehouseList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filter: {},
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
    filter: {},
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return state;
};
const WarehouseModule = (props: Props) => {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.createdAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.updatedAt), value: 'createdAt' },
  ];

  return (
    <UIConsumer>
      {uiState => (
        <ListConfigProvider filterName="filterWarehouse" initFilter={getInitFilter()}>
          <Layout
            {...uiState}
            navBar={
              <ListConfigConsumer>
                {({ filterAndSort, onChangeFilter }) => (
                  <NavBar>
                    <FilterToolBar
                      icon="WAREHOUSE"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
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
              {({ queryVariables }) => <WarehouseList {...queryVariables} />}
            </ListConfigConsumer>
          </Layout>
        </ListConfigProvider>
      )}
    </UIConsumer>
  );
};

export default injectIntl(WarehouseModule);
