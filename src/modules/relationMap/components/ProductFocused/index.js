// @flow
import React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import RelationView from '../RelationView';
import ProductCard from '../ProductElement/ProductCard';
import BatchCard from '../ProductElement/BatchCard';
import { Row, BatchListWrapperStyle } from './style';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  loadMore: Function,
};
const ProductFocused = ({ items, hasMore, loadMore }: Props) => (
  <RelationView
    items={items}
    hasMore={hasMore}
    className=""
    onLoadMore={loadMore}
    itemWidth={200}
    isEmpty={items.length === 0}
    spacing={0}
    emptyMessage="No Product found"
    render={({ item, index }) => (
      <Row key={index}>
        <ProductCard item={item} />
        <div className={BatchListWrapperStyle}>
          {getByPathWithDefault([], 'batches.nodes', item).map(batch => (
            <BatchCard key={batch.id} batch={batch} product={item} />
          ))}
        </div>
      </Row>
    )}
  />
);

export default ProductFocused;
