// @flow
import * as React from 'react';
import ContentLoader from 'react-content-loader';
import {
  ORDER_WIDTH,
  ORDER_ITEM_WIDTH,
  BATCH_WIDTH,
  CONTAINER_WIDTH,
  SHIPMENT_WIDTH,
  SHIPMENT_LONG_WIDTH,
} from 'modules/relationMapV2/constants';
import { FocusedView } from 'modules/relationMapV2/store';
import { colors } from 'styles/common';
import { InitLoadingPlaceholderWrapperStyle } from './style';

export default function InitLoadingPlaceholder() {
  const { selectors } = FocusedView.useContainer();

  const width = selectors.isShipmentFocus
    ? SHIPMENT_LONG_WIDTH + CONTAINER_WIDTH + BATCH_WIDTH + ORDER_ITEM_WIDTH + ORDER_WIDTH + 100
    : ORDER_WIDTH + ORDER_ITEM_WIDTH + BATCH_WIDTH + CONTAINER_WIDTH + SHIPMENT_WIDTH + 100;

  return (
    <div className={InitLoadingPlaceholderWrapperStyle(width)}>
      <ContentLoader
        width={width}
        height={1000}
        speed={2}
        backgroundColor={colors.GRAY_VERY_LIGHT}
        foregroundColor={colors.WHITE}
      >
        {selectors.isShipmentFocus ? (
          <>
            <rect x="10" y="10" rx="5" ry="5" width={SHIPMENT_LONG_WIDTH} height="55" />
            <rect
              x={SHIPMENT_LONG_WIDTH + 30}
              y="10"
              rx="5"
              ry="5"
              width={CONTAINER_WIDTH}
              height="55"
            />
            <rect
              x={SHIPMENT_LONG_WIDTH + CONTAINER_WIDTH + 50}
              y="10"
              rx="5"
              ry="5"
              width={BATCH_WIDTH}
              height="55"
            />
            <rect
              x={SHIPMENT_LONG_WIDTH + CONTAINER_WIDTH + BATCH_WIDTH + 70}
              y="10"
              rx="5"
              ry="5"
              width={ORDER_ITEM_WIDTH}
              height="55"
            />
            <rect
              x={SHIPMENT_LONG_WIDTH + CONTAINER_WIDTH + BATCH_WIDTH + ORDER_ITEM_WIDTH + 90}
              y="10"
              rx="5"
              ry="5"
              width={ORDER_WIDTH}
              height="55"
            />

            <rect
              x={SHIPMENT_LONG_WIDTH + 30}
              y="85"
              rx="5"
              ry="5"
              width={CONTAINER_WIDTH}
              height="55"
            />

            <rect
              x={SHIPMENT_LONG_WIDTH + 30}
              y="160"
              rx="5"
              ry="5"
              width={CONTAINER_WIDTH}
              height="55"
            />
            <rect
              x={SHIPMENT_LONG_WIDTH + CONTAINER_WIDTH + 50}
              y="160"
              rx="5"
              ry="5"
              width={BATCH_WIDTH}
              height="55"
            />

            <rect
              x={SHIPMENT_LONG_WIDTH + CONTAINER_WIDTH + 50}
              y="235"
              rx="5"
              ry="5"
              width={BATCH_WIDTH}
              height="55"
            />
            <rect
              x={SHIPMENT_LONG_WIDTH + CONTAINER_WIDTH + BATCH_WIDTH + ORDER_ITEM_WIDTH + 90}
              y="235"
              rx="5"
              ry="5"
              width={ORDER_WIDTH}
              height="55"
            />

            <rect x="10" y="310" rx="5" ry="5" width={SHIPMENT_LONG_WIDTH} height="55" />

            <rect x="10" y="385" rx="5" ry="5" width={SHIPMENT_LONG_WIDTH} height="55" />
            <rect
              x={SHIPMENT_LONG_WIDTH + 30}
              y="385"
              rx="5"
              ry="5"
              width={CONTAINER_WIDTH}
              height="55"
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </ContentLoader>
    </div>
  );
}
