// @flow
import React from 'react';
import { Display } from 'components/Form';
import { getByPathWithDefault } from 'utils/fp';
import { ProductBatchCard } from 'components/Cards';
import ProductCard from 'components/RelationMap/ProductElement/ProductCard';
import WrapperCard from 'components/RelationMap/OrderElement/WrapperCard';
import { RM_PRODUCT_BATCH_FORM } from 'modules/permission/constants/relationMap';
import usePermission from 'hooks/usePermission';
import { sortBatchByArrivalDate } from 'modules/relationMap/util';
import { ToggleSlide } from 'modules/relationMap/common/SlideForm';
import { Row, BatchListWrapperStyle, BatchListStyle } from './style';

type Props = {
  items: Array<Object>,
};

const ProductFocused = ({ items }: Props) => {
  const { hasPermission } = usePermission();
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return <Display align="left">No Product found.</Display>;
  }

  return (items.map(item => {
    const batches = getByPathWithDefault([], 'batches.nodes', item);
    if (batches.length > 1) {
      batches.sort(sortBatchByArrivalDate);
    }
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
                    <ProductBatchCard
                      batch={batch}
                      onClick={() =>
                        hasPermission(RM_PRODUCT_BATCH_FORM)
                          ? setSlide({
                              show: true,
                              type: 'BATCH',
                              id: batch.id,
                            })
                          : () => {}
                      }
                    />
                  )}
                </ToggleSlide>
              ))}
            </div>
          </div>
        ) : null}
      </Row>
    );
  }): Array<any>);
};

export default ProductFocused;
