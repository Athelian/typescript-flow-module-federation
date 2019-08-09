// @flow
import * as React from 'react';
import { RowStyle } from './style';
import type { CellRender, State } from '../OrderFocus/type.js.flow';
import cellRenderer from '../OrderFocus/cellRenderer';

type Props = {
  index: number,
  style: Object,
  data: Array<Array<{
      cell: ?CellRender,
      onClick: Function,
      dispatch: Function,
      state: State,
      isExpand: boolean,
    }>>,
};

const Cell = React.memo<Props>(({ index, style, data }: Props) => {
  const cells = data[index];
  return (
    <div className={RowStyle} style={style}>
      {cells.map(({ cell, onClick, dispatch, isExpand, state }) =>
        cellRenderer(cell, {
          onClick,
          dispatch,
          state,
          isExpand,
          style,
        })
      )}
    </div>
  );
});

export default Cell;
