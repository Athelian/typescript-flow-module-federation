// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { EntityIcon } from 'components/NavBar';
import ProductGridView from 'modules/product/list/components/ProductGridView';
import ProductCard from 'modules/product/list/components/ProductCard';
import LoadingIcon from 'components/LoadingIcon';
import { productListQuery } from 'modules/product/list/query';
import { getByPathWithDefault } from 'utils/fp';

type Props = {
  onLoadMore: Function,
  filtersAndSort: Object,
  onSelect: (item: Object) => void,
};

function SelectProducts({ onLoadMore, onSelect, filtersAndSort }: Props) {
  return (
    <div>
      <EntityIcon icon="PRODUCT" color="PRODUCT" />
      <Query query={productListQuery} variables={{ page: 1, ...filtersAndSort }}>
        {({ loading, data, error, fetchMore }) => {
          const nextPage = getByPathWithDefault(1, 'viewer.products.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.products.totalPage', data);
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          return (
            <ProductGridView
              onLoadMore={() => onLoadMore({ fetchMore, data })}
              hasMore={nextPage <= totalPage}
              isLoading={loading}
              items={getByPathWithDefault([], 'viewer.products.nodes', data)}
              renderItem={item => (
                <div key={item.id} role="presentation">
                  <ProductCard product={item} onClick={() => onSelect(item)} />
                </div>
              )}
            />
          );
        }}
      </Query>
    </div>
  );
}

export default SelectProducts;
