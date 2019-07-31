// @flow
import * as React from 'react';
import type { ProductPayload } from 'generated/graphql';
import { getByPathWithDefault } from 'utils/fp';
import BaseCard from 'components/Cards';
import TaskRing from 'components/TaskRing';
import ProductImage from 'components/ProductImage';
import { Display } from 'components/Form';
import QuantityChartMini from 'components/QuantityChartMini';
import {
  RMOrderItemCardWrapperStyle,
  ProductImageStyle,
  InfoWrapperStyle,
  NameWrapperStyle,
  SerialWrapperStyle,
  ChartWrapperStyle,
  TaskRingWrapperStyle,
} from './style';

type Props = {
  orderItem: {
    archived: boolean,
    productProvider: ProductPayload,
    orderedQuantity: number,
    batchedQuantity: number,
    shippedQuantity: number,
    batched: number,
    shipped: number,
    todo: {
      taskCount: {
        completed: number,
        inProgress: number,
        remain: number,
        skipped: number,
      },
    },
  },
};

const RMOrderItemCard = ({ orderItem }: Props) => {
  const {
    archived,
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    batched,
    shipped,
    todo,
  } = orderItem;
  const name = getByPathWithDefault('', 'productProvider.product.name', orderItem);
  const serial = getByPathWithDefault('', 'productProvider.product.serial', orderItem);
  const files = getByPathWithDefault([], 'productProvider.product.files', orderItem);

  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" isArchived={archived}>
      <div className={RMOrderItemCardWrapperStyle}>
        <ProductImage className={ProductImageStyle} path="pathSmall" file={files[0]} />

        <div className={InfoWrapperStyle}>
          <div className={NameWrapperStyle}>
            <Display align="left">{name}</Display>
          </div>

          <div className={SerialWrapperStyle}>{serial}</div>
        </div>

        <div className={ChartWrapperStyle}>
          <QuantityChartMini
            orderedQuantity={orderedQuantity}
            batchedQuantity={batchedQuantity}
            shippedQuantity={shippedQuantity}
            batched={batched}
            shipped={shipped}
          />
        </div>

        <div className={TaskRingWrapperStyle}>
          <TaskRing {...todo} size={18} />
        </div>
      </div>
    </BaseCard>
  );
};

export default RMOrderItemCard;
