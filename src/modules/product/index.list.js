// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import useListConfig from 'hooks/useListConfig';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import NoPermission from 'components/NoPermission';
import { PRODUCT_CREATE, PRODUCT_LIST } from 'modules/permission/constants/product';
import { PermissionConsumer } from 'modules/permission';
import ProductList from './list';
import { productsExportQuery } from './query';
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

const ProductListModule = (props: Props) => {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.serial), value: 'serial' },
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useListConfig(
    getInitFilter(),
    'filterProduct'
  );
  return (
    <PermissionConsumer>
      {hasPermission =>
        hasPermission(PRODUCT_LIST) ? (
          <UIConsumer>
            {uiState => (
              <Layout
                {...uiState}
                navBar={
                  <NavBar>
                    <FilterToolBar
                      icon="PRODUCT"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                    />
                    {hasPermission(PRODUCT_CREATE) && (
                      <Link to="new">
                        <NewButton data-testid="newButton" />
                      </Link>
                    )}
                    <ExportButton
                      type="Products"
                      exportQuery={productsExportQuery}
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
                <ProductList {...queryVariables} />
              </Layout>
            )}
          </UIConsumer>
        ) : (
          <NoPermission />
        )
      }
    </PermissionConsumer>
  );
};

export default injectIntl(ProductListModule);
