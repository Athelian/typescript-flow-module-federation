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
  ProductProviderSortConfig,
  ProductProviderFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { ProductProviderCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import useFilterSort from 'hooks/useFilterSort';
import { isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from '../../messages';
import Ids from '../Common/Ids';
import { productProvidersQuery, productProvidersByIDsQuery } from './query';
import { CardStyle } from './style';

type Props = {
  value: Array<string>,
  readonly: boolean,
  onChange: (Array<string>) => void,
};

type SelectorProps = {
  open: boolean,
  onClose: () => void,
  selected: Array<string>,
  setSelected: (Array<string>) => void,
};

const ProductProviderSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
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
              <EntityIcon icon="PRODUCT_PROVIDER" color="PRODUCT_PROVIDER" />
              <Filter
                config={ProductProviderFilterConfig}
                filterBy={filterBy}
                onChange={setFilterBy}
              />
              <Search query={query} onChange={setQuery} />
              <Sort config={ProductProviderSortConfig} sortBy={sortBy} onChange={setSortBy} />
              <CancelButton onClick={onClose} />
              <SaveButton
                disabled={isEquals(values, selected)}
                onClick={() => setSelected(values)}
              />
            </SlideViewNavBar>

            <Content>
              <Query
                query={productProvidersQuery}
                variables={{ filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 }}
                fetchPolicy="network-only"
              >
                {({ loading, data, fetchMore, error }) => {
                  if (error) {
                    return error.message;
                  }

                  const nextPage = (data?.productProviders?.page ?? 1) + 1;
                  const totalPage = data?.productProviders?.totalPage ?? 1;
                  const hasMore = nextPage <= totalPage;
                  const nodes = data?.productProviders?.nodes ?? [];

                  return (
                    <GridView
                      onLoadMore={() =>
                        loadMore({ fetchMore, data }, { filterBy, sortBy }, 'productProviders')
                      }
                      hasMore={hasMore}
                      isLoading={loading}
                      isEmpty={nodes.length === 0}
                      emptyMessage={null}
                      itemWidth="195px"
                    >
                      {nodes.map(productProvider => {
                        const isSelected = values.some(id => id === productProvider?.id);
                        return (
                          <ProductProviderCard
                            key={productProvider?.id}
                            productProvider={productProvider}
                            selectable
                            selected={isSelected}
                            onSelect={() => {
                              if (isSelected) {
                                filter(id => id !== productProvider?.id);
                              } else {
                                push(productProvider?.id);
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

const ProductProviderIds = ({ value, readonly, onChange }: Props) => (
  <Ids
    value={value}
    readonly={readonly}
    onChange={onChange}
    title={<FormattedMessage {...messages.productProviders} />}
    selector={ProductProviderSelector}
    query={productProvidersByIDsQuery}
    getItems={data => data?.productProvidersByIDs ?? []}
    renderItem={productProvider => (
      <BaseCard icon="ProductProvider" color="ProductProvider" wrapperClassName={CardStyle}>
        <Display height="30px">{productProvider?.name}</Display>
      </BaseCard>
    )}
  />
);

export default ProductProviderIds;
