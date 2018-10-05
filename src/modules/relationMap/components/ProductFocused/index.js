// @flow
import React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import DetailFocused, { ToggleSlide } from '../DetailFocused';
import RelationView from '../RelationView';
import ProductCard from '../ProductElement/ProductCard';
import BatchCard from '../ProductElement/BatchCard';
import WrapperCard from '../OrderElement/WrapperCard';
import { Row, BatchListWrapperStyle, ProductFocusContent } from './style';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  loadMore: Function,
};
const ProductFocused = ({ items, hasMore, loadMore }: Props) => (
  <>
    <RelationView
      items={items}
      hasMore={hasMore}
      className={ProductFocusContent}
      onLoadMore={loadMore}
      itemWidth={200}
      isEmpty={items.length === 0}
      spacing={0}
      emptyMessage="No Product found"
      render={({ item }) => (
        <Row key={item.id}>
          <ToggleSlide>
            {({ assign: setSlide }) => (
              <WrapperCard
                fit
                onDoubleClick={() =>
                  setSlide({
                    show: true,
                    type: 'PRODUCT',
                    id: item.id,
                  })
                }
              >
                <ProductCard item={item} />
              </WrapperCard>
            )}
          </ToggleSlide>
          <div className={BatchListWrapperStyle}>
            {getByPathWithDefault([], 'batches.nodes', item).map(batch => (
              <ToggleSlide key={batch.id}>
                {({ assign: setSlide }) => (
                  <WrapperCard
                    onDoubleClick={() =>
                      setSlide({
                        show: true,
                        type: 'BATCH',
                        id: batch.id,
                      })
                    }
                  >
                    <BatchCard key={batch.id} batch={batch} product={item} />
                  </WrapperCard>
                )}
              </ToggleSlide>
            ))}
          </div>
        </Row>
      )}
    />
    <DetailFocused />
  </>
);

export default ProductFocused;
