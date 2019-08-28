// @flow
import * as React from 'react';
import { areEqual } from 'react-window';
import LoadingIcon from 'components/LoadingIcon';
import { useSheetState } from '../SheetState';
import Cell from '../Cell';
import { Actions } from '../SheetState/contants';

type Props = {
  style: Object,
  columnIndex: number,
  rowIndex: number,
};

const CellRenderer = ({ style, columnIndex, rowIndex }: Props) => {
  const [foreignFocuses, setForeignFocuses] = React.useState<Array<Object>>([]);
  const { state, dispatch, mutate } = useSheetState();
  const { rows, focusedAt, weakFocusedAt, foreignFocusedAt, erroredAt, weakErroredAt } = state;
  const handleClick = React.useCallback(() => {
    dispatch({
      type: Actions.FOCUS,
      cell: { x: rowIndex, y: columnIndex },
    });
  }, [dispatch, columnIndex, rowIndex]);
  const handleFocusUp = React.useCallback(() => {
    dispatch({
      type: Actions.FOCUS_UP,
    });
  }, [dispatch]);
  const handleFocusDown = React.useCallback(() => {
    dispatch({
      type: Actions.FOCUS_DOWN,
    });
  }, [dispatch]);
  const handleUpdate = React.useCallback(
    value => {
      mutate({
        cell: { x: rowIndex, y: columnIndex },
        value,
      });
    },
    [mutate, columnIndex, rowIndex]
  );

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
        isFirstRow={rowIndex === 0}
        extended={cell.extended || 0}
        errors={
          erroredAt && erroredAt.x === rowIndex && erroredAt.y === columnIndex
            ? erroredAt.messages
            : null
        }
        weakError={!!weakErroredAt.find(e => e.x === rowIndex && e.y === columnIndex)}
        onClick={handleClick}
        onFocusUp={handleFocusUp}
        onFocusDown={handleFocusDown}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default React.memo<Props>(CellRenderer, areEqual);
