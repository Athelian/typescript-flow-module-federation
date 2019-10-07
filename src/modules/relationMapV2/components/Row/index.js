// @flow
import * as React from 'react';
// import type { OrderPayload } from 'generated/graphql';
import { RowStyle } from './style';
// import type { CellRender } from '../OrderFocus/type.js.flow';
import cellRenderer from '../OrderFocus/cellRenderer';
import LoadMorePlaceholder from '../LoadMorePlaceholder';

type Props = {
  index: number,
  style: Object,
  data: any,
};

const Row = React.memo<Props>(({ index, style, data }: Props) => {
  const cells = data[index];
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
        cellRenderer(cell, {
          onClick,
          isExpand,
          order,
        })
      )}
    </div>
  );
});

export default Row;
