// @flow
import * as React from 'react';
import type { OrderPayload, ShipmentPayload } from 'generated/graphql';
import type { CellRender } from 'modules/relationMapV2/type.js.flow';
import { FocusedView } from 'modules/relationMapV2/store';
import { RowStyle } from './style';
import orderRenderer from '../OrderFocus/cellRenderer';
import shipmentRenderer from '../ShipmentFocus/cellRenderer';
import LoadMorePlaceholder from '../LoadMorePlaceholder';

type Props = {
  index: number,
  style: Object,
  // eslint-disable-next-line flowtype/generic-spacing
  data: Array<
    Array<{
      cell: ?CellRender,
      onClick: Function,
      order?: OrderPayload,
      shipment?: ShipmentPayload,
      isExpand: boolean,
    }>
  >,
};

const Row = React.memo<Props>(({ index, style, data }: Props) => {
  const cells = data[index];
  const { selectors } = FocusedView.useContainer();
  const render = selectors.isShipmentFocus ? shipmentRenderer : orderRenderer;
  if (!data[index]) {
    return (
      <div className={RowStyle} style={style}>
        <LoadMorePlaceholder />
      </div>
    );
  }
  return (
    <div className={RowStyle} style={style}>
      {cells.map(({ cell, order, onClick, isExpand }) =>
        render(cell, {
          onClick,
          isExpand,
          order,
        })
      )}
    </div>
  );
});

export default Row;
