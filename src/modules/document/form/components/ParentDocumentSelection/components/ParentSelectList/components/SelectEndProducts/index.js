// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import loadMore from 'utils/loadMore';
import { Content, SlideViewNavBar } from 'components/Layout';
import GridView from 'components/GridView';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  ProductProviderFilterConfig,
  ProductProviderSortConfig,
} from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { getByPathWithDefault } from 'utils/fp';
import { isForbidden, isNotFound } from 'utils/data';
import useFilterSort from 'hooks/useFilterSort';
import { ProductProviderCard } from 'components/Cards';
import { productProvidersQuery } from './query';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
};

function SelectProductProviders({ cacheKey, onCancel, onSelect }: Props) {
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

  const { loading, data, fetchMore, error } = useQuery(productProvidersQuery, {
    fetchPolicy: 'network-only',
    variables,
  });

  const [selectedProductProvider, setSelectedProductProvider] = React.useState(null);

  const onSelectProductProvider = React.useCallback((productProvider: Object) => {
    setSelectedProductProvider(_selectedProductProvider =>
      _selectedProductProvider?.id === productProvider?.id ? null : productProvider
    );
  }, []);

  const productProviders = React.useMemo(() => {
    return getByPathWithDefault([], 'productProviders.nodes', data).filter(
      productProvider => !isForbidden(productProvider) && !isNotFound(productProvider)
    );
  }, [data]);

  if (error) {
    return error.message;
  }

  const nextPage = getByPathWithDefault(1, 'productProviders.page', data) + 1;
  const totalPage = getByPathWithDefault(1, 'productProviders.totalPage', data);
  const hasMore = nextPage <= totalPage;

  return (
    <>
      <SlideViewNavBar isSubNavBar>
        <EntityIcon icon="PRODUCT_PROVIDER" color="PRODUCT_PROVIDER" />
        <Filter
          config={ProductProviderFilterConfig}
          filterBy={filterBy}
          onChange={setFilterBy}
          staticFilters={['importerId', 'exporterId', 'archived']}
        />
        <Search query={query} onChange={setQuery} />
        <Sort config={ProductProviderSortConfig} sortBy={sortBy} onChange={setSortBy} />
        <CancelButton onClick={onCancel} />
        <SaveButton
          data-testid="btnSaveSelectProductProviders"
          disabled={!selectedProductProvider || loading}
          onClick={() => onSelect(selectedProductProvider)}
          isLoading={loading}
        />
      </SlideViewNavBar>

      <Content hasSubNavBar>
        <GridView
          onLoadMore={() => loadMore({ fetchMore, data }, variables, 'productProviders')}
          hasMore={hasMore}
          isLoading={loading}
          itemWidth="195px"
          isEmpty={productProviders.length === 0}
          emptyMessage={
            <FormattedMessage
              id="modules.Orders.noProductProvidersFound"
              defaultMessage="No end products found"
            />
          }
        >
          {productProviders.map(productProvider => {
            return (
              <div key={productProvider.id}>
                <ProductProviderCard
                  productProvider={productProvider}
                  selectable
                  selected={selectedProductProvider?.id === productProvider.id}
                  onSelect={onSelectProductProvider}
                />
              </div>
            );
          })}
        </GridView>
      </Content>
    </>
  );
}

const defaultProps = {
  cacheKey: 'SelectProductProviders',
};

SelectProductProviders.defaultProps = defaultProps;

export default SelectProductProviders;
