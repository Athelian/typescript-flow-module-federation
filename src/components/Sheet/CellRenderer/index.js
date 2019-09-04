// @flow
import * as React from 'react';
import { areEqual } from 'react-window';
import LoadingIcon from 'components/LoadingIcon';
import { useHasPermissions } from 'components/Context/Permissions';
import { Actions } from '../SheetState/contants';
import type { CellValue } from '../SheetState';
import { useSheetState } from '../SheetState';
import Cell from '../Cell';
import Deleted from './Announcements/Deleted';
import Added from './Announcements/Added';

type Props = {
  style: Object,
  columnIndex: number,
  rowIndex: number,
};

type WrapperProps = {
  cell: CellValue,
  columnIndex: number,
  rowIndex: number,
};

const CellWrapper = React.memo<WrapperProps>(({ cell, columnIndex, rowIndex }: WrapperProps) => {
  const hasPermission = useHasPermissions(cell?.entity?.ownedBy);
  const [foreignFocuses, setForeignFocuses] = React.useState<Array<Object>>([]);
  const { state, dispatch, mutate } = useSheetState();
  const { focusedAt, weakFocusedAt, foreignFocusedAt, erroredAt, weakErroredAt } = state;
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

  return (
    <Cell
      value={cell.data ? cell.data.value : null}
      type={cell.type}
      focus={!!focusedAt && focusedAt.x === rowIndex && focusedAt.y === columnIndex}
      weakFocus={!!weakFocusedAt.find(f => f.x === rowIndex && f.y === columnIndex)}
      foreignFocuses={foreignFocuses}
      readonly={cell.readonly || !(cell.entity && cell.entity.permissions(hasPermission))}
      forbidden={cell.forbidden || false}
      disabled={cell.disabled || false}
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
  );
});

const CellRenderer = ({ style, columnIndex, rowIndex }: Props) => {
  const { state, dispatch } = useSheetState();
  const { items, rows, addedRows, removedRows } = state;
  const itemsRef = React.useRef(items);

  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  if (rowIndex >= rows.length) {
    return columnIndex === 0 ? (
      <div style={style}>
        <LoadingIcon size={10} />
      </div>
    ) : null;
  }

  const addedRow = addedRows.find(row => row.start === rowIndex);
  const removedRow = removedRows.find(row => row.start === rowIndex);

  const cell = rows[rowIndex][columnIndex];

  return (
    <div style={style}>
      {(() => {
        if (columnIndex !== 0) {
          return null;
        }

        if (removedRow) {
          return (
            <Deleted
              start={removedRow.start}
              end={removedRow.end}
              onClear={() =>
                dispatch({
                  type: Actions.CLEAR_REMOVED_ROWS,
                  payload: removedRow.entity,
                })
              }
            />
          );
        }

        if (addedRow) {
          return (
            <Added
              start={addedRow.start}
              end={addedRow.end}
              onClear={() =>
                dispatch({
                  type: Actions.CLEAR_ADDED_ROWS,
                  payload: addedRow.entity,
                })
              }
            />
          );
        }

        return null;
      })()}
      {!cell.empty && <CellWrapper cell={cell} columnIndex={columnIndex} rowIndex={rowIndex} />}
    </div>
  );
};

export default React.memo<Props>(CellRenderer, areEqual);
