// @flow
import * as React from 'react';
import { areEqual } from 'react-window';
import LoadingIcon from 'components/LoadingIcon';
import { useSheetState } from '../SheetState';
import type { Area, CellValue } from '../SheetState/types';
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

function isInArea(area: Area, columnIndex: number, rowIndex: number): boolean {
  return (
    area.from.x <= rowIndex &&
    area.to.x >= rowIndex &&
    area.from.y <= columnIndex &&
    area.to.y >= columnIndex
  );
}

const CellRenderer = ({ style, columnIndex, rowIndex }: Props) => {
  const { state } = useSheetState();
  const {
    rows,
    items,
    addedRows,
    removedRows,
    hoverAt,
    focusAt,
    weakFocusAt,
    foreignFocusesAt,
    errorAt,
    weakErrorAt,
  } = state;
  const [users, setUsers] = React.useState<Array<Object>>([]);

  React.useEffect(() => {
    setUsers(
      foreignFocusesAt
        .filter(f => isInArea(f, columnIndex, rowIndex))
        .map(f => ({
          id: f.id,
          firstName: f.user.firstName,
          lastName: f.user.lastName,
        }))
    );
  }, [foreignFocusesAt, columnIndex, rowIndex]);

  const cell: CellValue = rows[rowIndex]?.[columnIndex];
  const item = React.useMemo<Object | null>(() => {
    if (!cell || !cell.data) {
      return null;
    }
    const itemIdx = parseFloat(cell.data.path.split('.')[0]);
    return items[itemIdx];
  }, [cell, items]);
  const isTop = cell && (!cell.merged || cell.merged.from.x === rowIndex);
  const addedRow = addedRows.find(row => row.from.x === rowIndex && row.from.y === columnIndex);
  const removedRow = removedRows.find(row => row.from.x === rowIndex && row.from.y === columnIndex);
  const onFirstRow = rowIndex === 0;
  const hasUserFocuses = users.length > 0;
  const isErrored =
    !!errorAt && errorAt.messages.length > 0 && isInArea(errorAt, columnIndex, rowIndex);
  const isFocused = !!focusAt && isInArea(focusAt, columnIndex, rowIndex);
  const ishovered = !!hoverAt && isInArea(hoverAt, columnIndex, rowIndex);
  const isWeakFocused = !!weakFocusAt.find(f => isInArea(f, columnIndex, rowIndex));
  const isWeakErrored = !!weakErrorAt.find(e => isInArea(e, columnIndex, rowIndex));
  const size = cell && cell.merged ? cell.merged.to.x - cell.merged.from.x + 1 : 1;

  return (
    <div style={{ ...style, top: style.top + 44 }}>
      {rowIndex >= rows.length || !cell ? (
        <LoadingIcon size={10} />
      ) : (
        <>
          {isTop && !isErrored && hasUserFocuses && ishovered && (
            <Users users={users} isFirstRow={onFirstRow} size={size} />
          )}

          {isTop && isErrored && (
            <Errors errors={errorAt?.messages ?? []} isFirstRow={onFirstRow} size={size} />
          )}

          {removedRow && <Deleted area={removedRow} />}
          {!removedRow && addedRow && <Added area={addedRow} />}

          <Cell
            cell={cell}
            item={item}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            hover={ishovered}
            focus={isFocused}
            weakFocus={isWeakFocused}
            foreignFocus={hasUserFocuses}
            error={isErrored}
            weakError={isWeakErrored}
          />
        </>
      )}
    </div>
  );
};

export default React.memo<Props>(CellRenderer, areEqual);
