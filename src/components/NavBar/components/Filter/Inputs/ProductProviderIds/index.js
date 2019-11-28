// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  ProductProviderSortConfig,
  ProductProviderFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar, SlideViewLayout } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { OrderProductProviderCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import Selector from 'components/Selector';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids, { type SelectorProps } from '../Common/Ids';
import { productProvidersQuery, productProvidersByIDsQuery } from './query';
import { CardStyle } from './style';

const ProductProviderSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    productProvidersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'productProviders'
  );

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <Selector.Many selected={selected.map(id => ({ id }))}>
        {({ value, dirty, getItemProps }) => (
          <SlideViewLayout>
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
                disabled={!dirty}
                onClick={() => setSelected(value.map(productProvider => productProvider.id))}
              />
            </SlideViewNavBar>

            <Content>
              <GridView
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loading}
                isEmpty={nodes.length === 0}
                emptyMessage={null}
                itemWidth="195px"
              >
                {nodes.map(productProvider => (
                  <OrderProductProviderCard
                    key={productProvider?.id}
                    productProvider={productProvider}
                    {...getItemProps(productProvider)}
                  />
                ))}
              </GridView>
            </Content>
          </SlideViewLayout>
        )}
      </Selector.Many>
    </SlideView>
  );
};

const ProductProviderIds = ({ value, readonly, onChange }: FilterInputProps<Array<string>>) => (
  <Ids
    value={value}
    readonly={readonly}
    onChange={onChange}
    title={<FormattedMessage {...messages.productProviders} />}
    selector={ProductProviderSelector}
    query={productProvidersByIDsQuery}
    getItems={data => data?.productProvidersByIDs ?? []}
    renderItem={productProvider => (
      <BaseCard icon="PRODUCT_PROVIDER" color="PRODUCT_PROVIDER" wrapperClassName={CardStyle}>
        <Display height="30px">{productProvider?.name}</Display>
      </BaseCard>
    )}
  />
);

export default ProductProviderIds;
