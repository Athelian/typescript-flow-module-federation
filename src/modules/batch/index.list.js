// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import ListConfigProvider, { ListConfigConsumer } from 'components/ListConfig';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import BatchList from './list';
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

const BatchListModule = (props: Props) => {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.batchNo), value: 'no' },
    { title: intl.formatMessage(messages.PO), value: 'poNo' },
    {
      title: intl.formatMessage(messages.productName),
      value: 'product',
    },
    {
      title: intl.formatMessage(messages.deliveredAt),
      value: 'deliveredAt',
    },
    {
      title: intl.formatMessage(messages.expiredAt),
      value: 'expiredAt',
    },
    {
      title: intl.formatMessage(messages.producedAt),
      value: 'producedAt',
    },
    {
      title: intl.formatMessage(messages.updatedAt),
      value: 'updatedAt',
    },
    {
      title: intl.formatMessage(messages.createdAt),
      value: 'createdAt',
    },
  ];

  return (
    <UIConsumer>
      {uiState => (
        <ListConfigProvider filterName="filterBatch" initFilter={getInitFilter()}>
          <Layout
            {...uiState}
            navBar={
              <ListConfigConsumer>
                {({ filterAndSort, onChangeFilter }) => (
                  <NavBar>
                    <FilterToolBar
                      icon="BATCH"
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
              {({ queryVariables }) => <BatchList {...queryVariables} />}
            </ListConfigConsumer>
          </Layout>
        </ListConfigProvider>
      )}
    </UIConsumer>
  );
};

export default injectIntl(BatchListModule);
