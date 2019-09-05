// @flow
import * as React from 'react';
import { areEqual } from 'react-window';
import LoadingIcon from 'components/LoadingIcon';
import { useSheetState } from '../SheetState';
import Deleted from './Announcements/Deleted';
import Added from './Announcements/Added';
import Users from './Users';
import Errors from './Errors';
import Cell from './Cell';

type Props = {
  style: Object,
  columnIndex: number,
  rowIndex: number,
};

const CellRenderer = ({ style, columnIndex, rowIndex }: Props) => {
  const { state } = useSheetState();
  const {
    rows,
    addedRows,
    removedRows,
    focusedAt,
    weakFocusedAt,
    foreignFocusedAt,
    erroredAt,
    weakErroredAt,
  } = state;
  const [users, setUsers] = React.useState<Array<Object>>([]);

  React.useEffect(() => {
    setUsers(
      foreignFocusedAt
        .filter(f => f.x === rowIndex && f.y === columnIndex)
        .map(f => ({
          id: f.id,
          firstName: f.user.firstName,
          lastName: f.user.lastName,
        }))
    );
  }, [foreignFocusedAt, columnIndex, rowIndex]);

  const cell = rows[rowIndex][columnIndex];
  const addedRow = addedRows.find(row => row.start === rowIndex);
  const removedRow = removedRows.find(row => row.start === rowIndex);
  const isFirstRow = rowIndex === 0;
  const hasUserFocuses = users.length > 0;
  const hasError =
    !!erroredAt &&
    erroredAt.messages.length > 0 &&
    erroredAt.x === rowIndex &&
    erroredAt.y === columnIndex;
  const hasRemovedRow = columnIndex === 0 && removedRow;
  const hasAddedRow = columnIndex === 0 && addedRow;
  const isFocus = !!focusedAt && focusedAt.x === rowIndex && focusedAt.y === columnIndex;
  const isWeakFocus = !!weakFocusedAt.find(f => f.x === rowIndex && f.y === columnIndex);
  const isWeakError = !!weakErroredAt.find(e => e.x === rowIndex && e.y === columnIndex);

  return (
    <div style={style}>
      {rowIndex >= rows.length ? (
        <LoadingIcon size={10} />
      ) : (
        <>
          {!hasError && hasUserFocuses && (
            <Users users={users} isFirstRow={isFirstRow} extended={cell.extended || 0} />
          )}

          {hasError && (
            <Errors
              errors={erroredAt?.messages ?? []}
              isFirstRow={isFirstRow}
              extended={cell.extended || 0}
            />
          )}

          {hasRemovedRow && <Deleted start={removedRow?.start ?? 0} end={removedRow?.end ?? 0} />}
          {!hasRemovedRow && hasAddedRow && (
            <Added start={addedRow?.start ?? 0} end={addedRow?.end ?? 0} />
          )}

          {!cell.empty && (
            <Cell
              cell={cell}
              columnIndex={columnIndex}
              rowIndex={rowIndex}
              focus={isFocus}
              weakFocus={isWeakFocus}
              foreignFocus={hasUserFocuses}
              error={hasError}
              weakError={isWeakError}
            />
          )}
        </>
      )}
    </div>
  );
};

export default React.memo<Props>(CellRenderer, areEqual);
