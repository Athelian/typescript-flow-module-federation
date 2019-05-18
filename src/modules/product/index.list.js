// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import { PRODUCT_CREATE, PRODUCT_EXPORT_LIST } from 'modules/permission/constants/product';
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
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.serial), value: 'serial' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterProduct'
  );
  return (
    <PermissionConsumer>
      {hasPermission => (
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
                  {hasPermission(PRODUCT_EXPORT_LIST) && (
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
                  )}
                </NavBar>
              }
            >
              <ProductList {...queryVariables} />
            </Layout>
          )}
        </UIConsumer>
      )}
    </PermissionConsumer>
  );
};

export default injectIntl(ProductListModule);
