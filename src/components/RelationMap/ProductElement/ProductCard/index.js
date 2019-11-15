// @flow
import React from 'react';
import { getBatchLatestQuantity } from 'utils/batch';
import BaseCard from 'components/Cards';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import ProductImage from 'components/ProductImage';
import QuantityChart from 'components/ProductFocusedChart';
import * as style from './style';

type Props = {
  item: Object,
};

// TODO: try to use from util
function getQuantitySummary(item: Object) {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let numOfBatched = 0;
  let numOfShipped = 0;
  if (item.batches.nodes) {
    item.batches.nodes.forEach(batch => {
      const { orderItem } = batch;

      const latestQuantity = getBatchLatestQuantity(batch);

      batchedQuantity += latestQuantity;
      numOfBatched += 1;

      if (orderItem) {
        orderedQuantity += orderItem.quantity || 0;
      }

      if (batch.shipment) {
        shippedQuantity += latestQuantity;
        numOfShipped += 1;
      }
    });
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    numOfBatched,
    numOfShipped,
  };
}

const ProductCard = ({ item }: Props) => {
  const { name, serial, productProviders = [], tags, files = [] } = item;
  const { supplier = {} } = productProviders[0] || [];
  const chartDetail = getQuantitySummary(item);
  return (
    <BaseCard icon="PRODUCT" color="PRODUCT">
      <div className={style.OrderItemCardWrapperStyle}>
        <div className={style.ProductWrapperStyle}>
          <ProductImage
            className={style.ProductImageStyle}
            height="80px"
            path="path"
            file={files[0]}
          />
          <div className={style.ProductInfoWrapperStyle}>
            <div className={style.ProductNameStyle}>{name}</div>
            <div className={style.ProductSerialStyle}>{serial}</div>
            <div className={style.ProductSupplierStyle}>
              <Icon icon="SUPPLIER" />
              {supplier && supplier.name}
            </div>
          </div>
        </div>
        <div className={style.BodyWrapperStyle}>
          <div className={style.ChartWrapperStyle}>
            <QuantityChart
              orderedQuantity={chartDetail.orderedQuantity}
              batchedQuantity={chartDetail.batchedQuantity}
              shippedQuantity={chartDetail.shippedQuantity}
              batched={chartDetail.numOfBatched}
              shipped={chartDetail.numOfShipped}
            />
          </div>
          <div className={style.ProductTagsWrapperStyle}>
            {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ProductCard;
