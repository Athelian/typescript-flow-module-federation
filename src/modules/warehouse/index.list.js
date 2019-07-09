// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { WAREHOUSE_CREATE } from 'modules/permission/constants/warehouse';
import usePermission from 'hooks/usePermission';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import WarehouseList from './list';
import { warehousesDefaultQueryVariables } from './constants';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

const WarehouseModule = (props: Props) => {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    warehousesDefaultQueryVariables,
    'warehousesFilter'
  );
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(WAREHOUSE_CREATE);
  return (
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <FilterToolBar
                icon="WAREHOUSE"
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
          <WarehouseList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
};

export default injectIntl(WarehouseModule);
