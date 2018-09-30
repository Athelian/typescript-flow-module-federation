// @flow
import React from 'react';
import BaseCard from 'components/Cards';
import * as style from 'components/Cards/OrderItemCard/style';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import QuantityChart from 'components/QuantityChart';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';

type Props = {
  item: Object,
};

function getQuantitySummary(item: Object) {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let numOfBatched = 0;
  let numOfShipped = 0;

  orderedQuantity += item.quantity ? item.quantity : 0;

  if (item.batches) {
    item.batches.forEach(batch => {
      batchedQuantity += batch.quantity;
      numOfBatched += 1;
      if (batch.batchAdjustments) {
        batch.batchAdjustments.forEach(batchAdjustment => {
          batchedQuantity += batchAdjustment.quantity;
        });
      }
      if (batch.shipment) {
        shippedQuantity += batch.quantity;
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
  const {
    name,
    serial,
    productProvider: { supplier },
    tags,
  } = item;
  const chartDetail = getQuantitySummary(item);
  return (
    <BaseCard icon="PRODUCT" color="PRODUCT">
      <div className={style.OrderItemCardWrapperStyle}>
        <div className={style.ProductWrapperStyle}>
          <img className={style.ProductImageStyle} src={FALLBACK_IMAGE} alt="product_image" />
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
              hasLabel={false}
              orderedQuantity={chartDetail.orderedQuantity}
              batchedQuantity={chartDetail.batchedQuantity}
              shippedQuantity={chartDetail.shippedQuantity}
              batched={chartDetail.numOfBatched}
              shipped={chartDetail.numOfShipped}
            />
          </div>
          <div className={style.ProductTagsWrapperStyle}>
            {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ProductCard;
