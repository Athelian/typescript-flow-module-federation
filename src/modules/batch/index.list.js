// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
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
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterBatch'
  );

  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(BATCH_CREATE);

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
              {allowCreate && (
                <Link to="new">
                  <NewButton />
                </Link>
              )}
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
