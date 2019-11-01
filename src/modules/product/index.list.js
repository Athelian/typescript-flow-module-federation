// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { Content } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  NavBar,
  ProductFilterConfig,
  ProductSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import { PRODUCT_CREATE, PRODUCT_EXPORT_LIST } from 'modules/permission/constants/product';
import { useViewerHasPermissions } from 'contexts/Permissions';
import useFilterSort from 'hooks/useFilterSort';
import ProductList from './list';
import { productsExportQuery } from './query';

const ProductListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'product_cards'
  );

  const hasPermissions = useViewerHasPermissions();

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="PRODUCT" color="PRODUCT" subIcon="CARDS" />

        <Filter config={ProductFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={ProductSortConfig} sortBy={sortBy} onChange={setSortBy} />

        {hasPermissions(PRODUCT_CREATE) && (
          // $FlowFixMe Flow typed is not updated yet
          <Link to="/product/new">
            <NewButton data-testid="newButton" />
          </Link>
        )}

        {hasPermissions(PRODUCT_EXPORT_LIST) && (
          <ExportButton
            type="Products"
            exportQuery={productsExportQuery}
            variables={{
              filterBy: { query, ...filterBy },
              sortBy,
            }}
          />
        )}
      </NavBar>
      <ProductList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default ProductListModule;
