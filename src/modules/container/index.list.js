// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import { ExportButton } from 'components/Buttons';
import useFilter from 'hooks/useFilter';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import ContainerList from './list';
import { containersExportQuery } from './query';
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

function OrderModule(props: Props) {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.warehouseName), value: 'warehouseName' },
    {
      title: intl.formatMessage(messages.warehouseArrivalActualDate),
      value: 'warehouseArrivalActualDate',
    },
    {
      title: intl.formatMessage(messages.warehouseArrivalAgreedDate),
      value: 'warehouseArrivalAgreedDate',
    },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterContainer'
  );
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
              <ExportButton
                type="Containers"
                exportQuery={containersExportQuery}
                variables={{
                  filterBy: filterAndSort.filter,
                  sortBy: {
                    [filterAndSort.sort.field]: filterAndSort.sort.direction,
                  },
                }}
              />
            </NavBar>
          }
        >
          <ContainerList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
}

export default injectIntl(OrderModule);
