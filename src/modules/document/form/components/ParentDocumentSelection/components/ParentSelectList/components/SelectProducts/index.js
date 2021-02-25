// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import loadMore from 'utils/loadMore';
import type { Product, ProductProvider } from 'generated/graphql';
import { Content, SlideViewNavBar } from 'components/Layout';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { ProductCard } from 'components/Cards';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  ProductFilterConfig,
  ProductSortConfig,
} from 'components/NavBar';
import { CancelButton } from 'components/Buttons';
import { getByPathWithDefault } from 'utils/fp';
import { isForbidden, isNotFound } from 'utils/data';
import useFilterSort from 'hooks/useFilterSort';
import { productsQuery } from './query';
import SelectEndProduct from './SelectEndProduct';

type OptionalProps = {
  cacheKey: string,
  isLoading?: boolean,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
};

function SelectProducts({ cacheKey, isLoading = false, onCancel, onSelect }: Props) {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    cacheKey
  );

  const variables = {
    filterBy: { query, ...filterBy },
    sortBy,
    page: 1,
    perPage: 20,
  };

  const { loading: isQuerying, data, fetchMore, error } = useQuery(productsQuery, {
    fetchPolicy: 'network-only',
    variables,
  });

  const [isEndProductViewOpen, setEndProductViewOpen] = React.useState(false);

  const [selectedItems, setSelectedItems] = React.useState({
    product: null,
    endProduct: null,
  });

  const onSelectProduct = React.useCallback((product: Product) => {
    setSelectedItems(_selectedItems => ({
      ..._selectedItems,
      product: _selectedItems.product?.id === product?.id ? null : product,
    }));

    setEndProductViewOpen(true);
  }, []);

  const onSelectEndProduct = React.useCallback(
    (newEndProduct: ProductProvider) => {
      setSelectedItems(_items => ({
        ..._items,
        endProduct: newEndProduct,
      }));

      if (onSelect) {
        onSelect({
          ...newEndProduct,
          product: {
            ...selectedItems.product,
          },
        });
      }
    },
    [onSelect, selectedItems.product]
  );

  const products = React.useMemo(() => {
    return getByPathWithDefault([], 'products.nodes', data).filter(
      product => !isForbidden(product) && !isNotFound(product)
    );
  }, [data]);

  if (error) {
    return error.message;
  }

  const nextPage = getByPathWithDefault(1, 'products.page', data) + 1;
  const totalPage = getByPathWithDefault(1, 'products.totalPage', data);
  const hasMore = nextPage <= totalPage;

  return (
    <>
      <SlideViewNavBar isSubNavBar>
        <EntityIcon icon="PRODUCT" color="PRODUCT" />
        <Filter
          config={ProductFilterConfig}
          filterBy={filterBy}
          onChange={setFilterBy}
          staticFilters={['importerId', 'exporterId', 'archived']}
        />
        <Search query={query} onChange={setQuery} />
        <Sort config={ProductSortConfig} sortBy={sortBy} onChange={setSortBy} />
        <CancelButton onClick={onCancel} disabled={isLoading} />
      </SlideViewNavBar>

      <Content hasSubNavBar>
        <GridView
          onLoadMore={() => loadMore({ fetchMore, data }, variables, 'products')}
          hasMore={hasMore}
          isLoading={isQuerying}
          itemWidth="195px"
          isEmpty={products.length === 0}
          emptyMessage={
            <FormattedMessage
              id="modules.Products.noProductFound"
              defaultMessage="No products found"
            />
          }
        >
          {products.map(product => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => {
                  onSelectProduct(product);
                }}
                staticImage
              />
            );
          })}
        </GridView>
        <SlideView
          shouldConfirm={false}
          isOpen={isEndProductViewOpen}
          onRequestClose={() => {
            setEndProductViewOpen(false);
            setSelectedItems({
              product: null,
              endProduct: null,
            });
          }}
        >
          {isEndProductViewOpen && selectedItems.product && (
            <SelectEndProduct
              productProviders={selectedItems.product.productProviders}
              onCancel={() => {
                setEndProductViewOpen(false);
              }}
              onSelect={onSelectEndProduct}
            />
          )}
        </SlideView>
      </Content>
    </>
  );
}

const defaultProps = {
  cacheKey: 'SelectProducts',
};

SelectProducts.defaultProps = defaultProps;

export default SelectProducts;
