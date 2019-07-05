// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import TaskRing from 'components/TaskRing';
import { Display } from 'components/Form';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
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
    productProvider: {
      product: {
        name: string,
        serial: string,
        files: Array<{
          pathSmall: string,
        }>,
      },
    },
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

const RMOrderItemCard = ({
  orderItem: {
    archived,
    productProvider,
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    batched,
    shipped,
    todo,
  },
}: Props) => {
  const { product } = productProvider || {};

  const { name, serial, files } = product || {};

  const productImage = files && files.length > 0 ? files[0].pathSmall : FALLBACK_IMAGE;

  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" isArchived={archived}>
      <div className={RMOrderItemCardWrapperStyle}>
        <img className={ProductImageStyle} src={productImage} alt="product_image" />

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
