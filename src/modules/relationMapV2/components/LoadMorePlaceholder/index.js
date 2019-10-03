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
import { LoadMorePlaceholderWrapperStyle } from './style';

export default function LoadMorePlaceholder() {
  const width =
    ORDER_WIDTH + ORDER_ITEM_WIDTH + BATCH_WIDTH + CONTAINER_WIDTH + SHIPMENT_WIDTH + 100;

  return (
    <div className={LoadMorePlaceholderWrapperStyle(width)}>
      <ContentLoader
        width={width}
        height={75}
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
      </ContentLoader>
    </div>
  );
}
