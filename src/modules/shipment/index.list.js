// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import usePermission from 'hooks/usePermission';
import { SHIPMENT_CREATE } from 'modules/permission/constants/shipment';
import { UIConsumer } from 'modules/ui';
import FilterToolBar from 'components/common/FilterToolBar';
import useListConfig from 'hooks/useListConfig';
import Layout from 'components/Layout';
import NavBar from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import ShipmentList from './list';
import { shipmentsExportQuery } from './query';
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

const ShipmentListModule = (props: Props) => {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useListConfig(
    getInitFilter(),
    'filterShipment'
  );
  const { hasPermission } = usePermission();
  return (
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <FilterToolBar
                icon="SHIPMENT"
                sortFields={sortFields}
                filtersAndSort={filterAndSort}
                onChange={onChangeFilter}
              />
              {hasPermission(SHIPMENT_CREATE) && (
                <Link to="new">
                  <NewButton />
                </Link>
              )}
              <ExportButton
                type="Shipments"
                exportQuery={shipmentsExportQuery}
                variables={{
                  sortBy: {
                    [filterAndSort.sort.field]: filterAndSort.sort.direction,
                  },
                  filterBy: filterAndSort.filter,
                }}
              />
            </NavBar>
          }
        >
          <ShipmentList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
};

export default injectIntl(ShipmentListModule);
