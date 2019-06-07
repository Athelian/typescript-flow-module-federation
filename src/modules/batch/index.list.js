// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import useFilter from 'hooks/useFilter';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import BatchList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

const getInitFilter = () => {
  const state = {
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
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.batchNo), value: 'no' },
    { title: intl.formatMessage(messages.poNo), value: 'poNo' },
    { title: intl.formatMessage(messages.productName), value: 'productName' },
    { title: intl.formatMessage(messages.productSerial), value: 'productSerial' },
    { title: intl.formatMessage(messages.deliveredAt), value: 'deliveredAt' },
    { title: intl.formatMessage(messages.expiredAt), value: 'expiredAt' },
    { title: intl.formatMessage(messages.producedAt), value: 'producedAt' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterBatch'
  );

  return (
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <FilterToolBar
                icon="BATCH"
                sortFields={sortFields}
                filtersAndSort={filterAndSort}
                onChange={onChangeFilter}
              />
            </NavBar>
          }
        >
          <BatchList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
};

export default injectIntl(BatchListModule);
