// @flow
import * as React from 'react';
import { areEqual } from 'react-window';
import LoadingIcon from 'components/LoadingIcon';
import { useSheetState } from '../SheetState';
import Cell from '../Cell';

type Props = {
  style: Object,
  columnIndex: number,
  rowIndex: number,
};

const CellRenderer = ({ style, columnIndex, rowIndex }: Props) => {
  const [foreignFocuses, setForeignFocuses] = React.useState<Array<Object>>([]);
  const { state, dispatch } = useSheetState();
  const { rows, focusedAt, weakFocusedAt, foreignFocusedAt } = state;

  React.useEffect(() => {
    setForeignFocuses(
      foreignFocusedAt
        .filter(f => f.x === rowIndex && f.y === columnIndex)
        .map(f => ({
          id: f.id,
          firstName: f.user.firstName,
          lastName: f.user.lastName,
        }))
    );
  }, [foreignFocusedAt, columnIndex, rowIndex]);

  if (rowIndex >= rows.length) {
    return columnIndex === 0 ? (
      <div style={style}>
        <LoadingIcon size={10} />
      </div>
    ) : null;
  }

  const cell = rows[rowIndex][columnIndex];
  if (cell.empty) {
    return null;
  }

  return (
    <div style={style}>
      <Cell
        value={cell.data ? cell.data.value : null}
        type={cell.type}
        focus={!!focusedAt && focusedAt.x === rowIndex && focusedAt.y === columnIndex}
        weakFocus={!!weakFocusedAt.find(f => f.x === rowIndex && f.y === columnIndex)}
        foreignFocuses={foreignFocuses}
        readonly={cell.readonly || false}
        forbidden={cell.forbidden || false}
        disabled={cell.disabled || false} // TODO: use hasPermission thing
        onFirstRow={rowIndex === 0}
        extended={cell.extended || 0}
        dispatch={action => dispatch({ ...action, cell: { x: rowIndex, y: columnIndex } })}
      />
    </div>
  );
};

export default React.memo<Props>(CellRenderer, areEqual);
