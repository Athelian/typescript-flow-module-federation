// @flow
import * as React from 'react';
import { areEqual } from 'react-window';
import LoadingIcon from 'components/LoadingIcon';
import type { CellData } from '../SheetState/types';
import Deleted from './Announcements/Deleted';
import Added from './Announcements/Added';
import Users from './Users';
import Errors from './Errors';
import Cell from './Cell';

type Props = {
  data: Array<Array<CellData>>,
  style: Object,
  columnIndex: number,
  rowIndex: number,
};

const CellRenderer = ({ data, style, columnIndex, rowIndex }: Props) => {
  const cellData = data[rowIndex]?.[columnIndex];

  const isTop =
    cellData?.cell && (!cellData?.cell?.merged || cellData?.cell?.merged?.from?.x === rowIndex);
  const onFirstRow = rowIndex === 0;
  const hasUserFocuses = cellData?.foreignUsers.length > 0;
  const isErrored = !!cellData?.error;
  const size = cellData?.cell?.merged
    ? (cellData.cell.merged?.to.x ?? 0) - (cellData.cell.merged?.from.x ?? 0) + 1
    : 1;

  return (
    <div style={{ ...style, top: style.top + 44 }}>
      {rowIndex >= data.length || !cellData ? (
        <LoadingIcon size={10} />
      ) : (
        <>
          {isTop && !isErrored && hasUserFocuses && cellData.hovered && (
            <Users users={cellData.foreignUsers} isFirstRow={onFirstRow} size={size} />
          )}

          {isTop && isErrored && (
            <Errors errors={cellData.error?.messages ?? []} isFirstRow={onFirstRow} size={size} />
          )}

          {cellData.removedRow && <Deleted area={cellData.removedRow} />}
          {!cellData.removedRow && cellData.addedRow && <Added area={cellData.addedRow} />}

          <Cell
            cell={cellData.cell}
            parentCell={cellData.parentCell}
            item={cellData.item}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            hover={cellData.hovered}
            focus={cellData.focused}
            weakFocus={cellData.weakFocused}
            foreignFocus={hasUserFocuses}
            error={isErrored}
            weakError={cellData.weakErrored}
            dispatch={cellData.dispatch}
            mutate={cellData.mutate}
          />
        </>
      )}
    </div>
  );
};

export default React.memo<Props>(CellRenderer, areEqual);
