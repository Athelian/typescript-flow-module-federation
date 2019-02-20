// @flow
import React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import ProductCard from 'components/RelationMap/ProductElement/ProductCard';
import BatchCard from 'components/RelationMap/ProductElement/BatchCard';
import WrapperCard from 'components/RelationMap/OrderElement/WrapperCard';
import { sortBatchByArrivalDate } from 'modules/relationMap/util';
import DetailFocused, { ToggleSlide } from 'modules/relationMap/common/SlideForm';
import RelationView from 'modules/relationMap/common/RelationView';
import { ProductListWrapperStyle, Row, BatchListWrapperStyle, BatchListStyle } from './style';

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
      className={ProductListWrapperStyle}
      onLoadMore={loadMore}
      itemWidth={200}
      isEmpty={items.length === 0}
      spacing={0}
      emptyMessage="No Product found"
      render={({ item }) => {
        const batches = getByPathWithDefault([], 'batches.nodes', item);
        batches.sort(sortBatchByArrivalDate);
        return (
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
            {batches && batches.length ? (
              <div className={BatchListWrapperStyle}>
                <div className={BatchListStyle}>
                  {batches.map(batch => (
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
                          <BatchCard batch={batch} product={item} />
                        </WrapperCard>
                      )}
                    </ToggleSlide>
                  ))}
                </div>
              </div>
            ) : null}
          </Row>
        );
      }}
    />
    <DetailFocused />
  </>
);

export default ProductFocused;
