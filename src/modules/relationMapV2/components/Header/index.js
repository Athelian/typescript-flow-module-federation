// @flow
import * as React from 'react';
import {
  ORDER_WIDTH,
  ORDER_ITEM_WIDTH,
  BATCH_WIDTH,
  CONTAINER_WIDTH,
  SHIPMENT_WIDTH,
} from 'modules/relationMapV2/constants';
import { HeadingStyle, RowStyle } from './style';

type Props = { style?: Object };

const Header = React.memo<Props>(({ style }: Props) => {
  return (
    <div style={style} className={RowStyle}>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#ED5724',
          width: ORDER_WIDTH,
        }}
      >
        Orders
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#FBAA1D',
          width: ORDER_ITEM_WIDTH,
        }}
      >
        Items
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#12B937',
          width: BATCH_WIDTH,
        }}
      >
        Batches
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#30A8E4',
          width: CONTAINER_WIDTH,
        }}
      >
        Containers
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#0756AF',
          width: SHIPMENT_WIDTH,
        }}
      >
        Shipments
      </div>
    </div>
  );
});

export default Header;
