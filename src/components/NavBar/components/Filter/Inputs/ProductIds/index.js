// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  ProductSortConfig,
  ProductFilterConfig,
  BulkHeaderFilter,
} from 'components/NavBar';
import { CancelButton, SaveButton, SelectAllButton } from 'components/Buttons';
import { Content, SlideViewNavBar, SlideViewLayout } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { ProductCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import Selector from 'components/Selector';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids, { type SelectorProps } from '../Common/Ids';
import { productsQuery, productsByIDsQuery } from './query';
import { CardStyle } from './style';

const ProductSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    productsQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'products'
  );

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <Selector.Many items={nodes} selected={selected.map(id => ({ id }))}>
        {({ value, dirty, getItemProps, isAllSelected, onSelectAll }) => (
          <SlideViewLayout>
            <SlideViewNavBar>
              <EntityIcon icon="PRODUCT" color="PRODUCT" />
              <Filter config={ProductFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
              <Search query={query} onChange={setQuery} />
              <BulkHeaderFilter filterBy={filterBy} setFilterBy={setFilterBy} type="PRODUCT" />
              <Sort config={ProductSortConfig} sortBy={sortBy} onChange={setSortBy} />
              <CancelButton onClick={onClose} />
              <SaveButton
                disabled={!dirty}
                onClick={() => {
                  const newSelected = value.map(product => product.id);
                  setSelected([...new Set(newSelected)]);
                }}
              />
              <SelectAllButton
                right={15}
                disabled={loading}
                isAllSelected={isAllSelected}
                onClick={() => {
                  onSelectAll(nodes);
                }}
                labelSuffix={` ${nodes.length}`}
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
                {nodes.map(product => (
                  <ProductCard key={product?.id} product={product} {...getItemProps(product)} />
                ))}
              </GridView>
            </Content>
          </SlideViewLayout>
        )}
      </Selector.Many>
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
