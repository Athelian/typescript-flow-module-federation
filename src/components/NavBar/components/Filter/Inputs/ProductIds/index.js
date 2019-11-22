// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ArrayValue } from 'react-values';
import { Query } from 'react-apollo';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  ProductSortConfig,
  ProductFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { ProductCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import useFilterSort from 'hooks/useFilterSort';
import { isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids from '../Common/Ids';
import { productsQuery, productsByIDsQuery } from './query';
import { CardStyle } from './style';

type SelectorProps = {
  open: boolean,
  onClose: () => void,
  selected: Array<string>,
  setSelected: (Array<string>) => void,
};

const ProductSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' }
  );

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <ArrayValue defaultValue={selected}>
        {({ value: values, push, filter }) => (
          <>
            <SlideViewNavBar>
              <EntityIcon icon="PRODUCT" color="PRODUCT" />
              <Filter config={ProductFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
              <Search query={query} onChange={setQuery} />
              <Sort config={ProductSortConfig} sortBy={sortBy} onChange={setSortBy} />
              <CancelButton onClick={onClose} />
              <SaveButton
                disabled={isEquals(values, selected)}
                onClick={() => setSelected(values)}
              />
            </SlideViewNavBar>

            <Content>
              <Query
                query={productsQuery}
                variables={{ filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 }}
                fetchPolicy="network-only"
              >
                {({ loading, data, fetchMore, error }) => {
                  if (error) {
                    return error.message;
                  }

                  const nextPage = (data?.products?.page ?? 1) + 1;
                  const totalPage = data?.products?.totalPage ?? 1;
                  const hasMore = nextPage <= totalPage;
                  const nodes = data?.products?.nodes ?? [];

                  return (
                    <GridView
                      onLoadMore={() =>
                        loadMore({ fetchMore, data }, { filterBy, sortBy }, 'products')
                      }
                      hasMore={hasMore}
                      isLoading={loading}
                      isEmpty={nodes.length === 0}
                      emptyMessage={null}
                      itemWidth="195px"
                    >
                      {nodes.map(product => {
                        const isSelected = values.some(id => id === product?.id);
                        return (
                          <ProductCard
                            key={product?.id}
                            product={product}
                            selectable
                            selected={isSelected}
                            onSelect={() => {
                              if (isSelected) {
                                filter(id => id !== product?.id);
                              } else {
                                push(product?.id);
                              }
                            }}
                          />
                        );
                      })}
                    </GridView>
                  );
                }}
              </Query>
            </Content>
          </>
        )}
      </ArrayValue>
    </SlideView>
  );
};

const ProductIds = ({ value, readonly, onChange }: FilterInputProps<Array<string>>) => (
  <Ids
    value={value}
    readonly={readonly}
    onChange={onChange}
    title={<FormattedMessage {...messages.products} />}
    selector={ProductSelector}
    query={productsByIDsQuery}
    getItems={data => data?.productsByIDs ?? []}
    renderItem={product => (
      <BaseCard icon="PRODUCT" color="PRODUCT" wrapperClassName={CardStyle}>
        <Display height="30px">{product?.name}</Display>
      </BaseCard>
    )}
  />
);

export default ProductIds;
