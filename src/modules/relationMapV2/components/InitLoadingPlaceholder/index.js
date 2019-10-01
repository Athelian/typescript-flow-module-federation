// @flow
import * as React from 'react';
import ContentLoader from 'react-content-loader';
import {
  ORDER_WIDTH,
  ORDER_ITEM_WIDTH,
  BATCH_WIDTH,
  CONTAINER_WIDTH,
  SHIPMENT_WIDTH,
} from 'modules/relationMapV2/constants';
import { colors } from 'styles/common';
import { InitLoadingPlaceholderWrapperStyle } from './style';

export default function InitLoadingPlaceholder() {
  const width =
    ORDER_WIDTH + ORDER_ITEM_WIDTH + BATCH_WIDTH + CONTAINER_WIDTH + SHIPMENT_WIDTH + 100;

  return (
    <div className={InitLoadingPlaceholderWrapperStyle(width)}>
      <ContentLoader
        width={width}
        height={1000}
        speed={2}
        primaryColor={colors.GRAY_VERY_LIGHT}
        secondaryColor={colors.WHITE}
      >
        <rect x="10" y="10" rx="5" ry="5" width={ORDER_WIDTH} height="55" />
        <rect x={ORDER_WIDTH + 30} y="10" rx="5" ry="5" width={ORDER_ITEM_WIDTH} height="55" />
        <rect
          x={ORDER_WIDTH + ORDER_ITEM_WIDTH + 50}
          y="10"
          rx="5"
          ry="5"
          width={BATCH_WIDTH}
          height="55"
        />
        <rect
          x={ORDER_WIDTH + ORDER_ITEM_WIDTH + BATCH_WIDTH + 70}
          y="10"
          rx="5"
          ry="5"
          width={CONTAINER_WIDTH}
          height="55"
        />
        <rect
          x={ORDER_WIDTH + ORDER_ITEM_WIDTH + BATCH_WIDTH + CONTAINER_WIDTH + 90}
          y="10"
          rx="5"
          ry="5"
          width={SHIPMENT_WIDTH}
          height="55"
        />

        <rect x={ORDER_WIDTH + 30} y="85" rx="5" ry="5" width={ORDER_ITEM_WIDTH} height="55" />

        <rect x={ORDER_WIDTH + 30} y="160" rx="5" ry="5" width={ORDER_ITEM_WIDTH} height="55" />
        <rect
          x={ORDER_WIDTH + ORDER_ITEM_WIDTH + 50}
          y="160"
          rx="5"
          ry="5"
          width={BATCH_WIDTH}
          height="55"
        />

        <rect
          x={ORDER_WIDTH + ORDER_ITEM_WIDTH + 50}
          y="235"
          rx="5"
          ry="5"
          width={BATCH_WIDTH}
          height="55"
        />
        <rect
          x={ORDER_WIDTH + ORDER_ITEM_WIDTH + BATCH_WIDTH + CONTAINER_WIDTH + 90}
          y="235"
          rx="5"
          ry="5"
          width={SHIPMENT_WIDTH}
          height="55"
        />

        <rect x="10" y="310" rx="5" ry="5" width={ORDER_WIDTH} height="55" />

        <rect x="10" y="385" rx="5" ry="5" width={ORDER_WIDTH} height="55" />
        <rect x={ORDER_WIDTH + 30} y="385" rx="5" ry="5" width={ORDER_ITEM_WIDTH} height="55" />
      </ContentLoader>
    </div>
  );
}
