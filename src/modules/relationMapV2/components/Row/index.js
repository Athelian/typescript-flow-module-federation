// @flow
import * as React from 'react';
import type { OrderPayload } from 'generated/graphql';
import { RowStyle } from './style';
import type { CellRender } from '../OrderFocus/type.js.flow';
import cellRenderer from '../OrderFocus/cellRenderer';

type Props = {
  index: number,
  style: Object,
  data: Array<Array<{
      cell: ?CellRender,
      onClick: Function,
      order: OrderPayload,
      isExpand: boolean,
    }>>,
};

const Row = React.memo<Props>(({ index, style, data }: Props) => {
  const cells = data[index];
  return (
    <div className={RowStyle} style={style}>
      {cells.map(({ cell, order, onClick, isExpand }) =>
        cellRenderer(cell, {
          onClick,
          isExpand,
          style,
          order,
        })
      )}
    </div>
  );
});

export default Row;
