// @flow
import React from 'react';
import { getBatchLatestQuantity } from 'utils/batch';
import BaseCard from 'components/Cards';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import QuantityChart from 'components/ProductFocusedChart';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
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
      const { quantity, batchQuantityRevisions, orderItem } = batch;

      const latestQuantity = getBatchLatestQuantity({ quantity, batchQuantityRevisions });

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
  const { name, serial, productProviders = [], tags, files } = item;
  const { supplier = {} } = productProviders[0];
  const chartDetail = getQuantitySummary(item);
  return (
    <BaseCard icon="PRODUCT" color="PRODUCT">
      <div className={style.OrderItemCardWrapperStyle}>
        <div className={style.ProductWrapperStyle}>
          <img
            className={style.ProductImageStyle}
            src={(files.length && files[0].path) || FALLBACK_IMAGE}
            alt="product_image"
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
