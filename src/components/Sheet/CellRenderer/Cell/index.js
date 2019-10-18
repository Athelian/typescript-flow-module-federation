// @flow
import * as React from 'react';
import { useHasPermissions } from 'contexts/Permissions';
import { Blackout } from 'components/Form';
import type { CellValue } from '../../SheetState/types';
import { useCell, useSheetState } from '../../SheetState';
import { Actions } from '../../SheetState/contants';
import CellInput from './CellInput';
import CellDisplay from './CellDisplay';
import { CellStyle, CellBorderStyle, CellPlaceholderStyle, CellShadowStyle } from './style';

type Props = {
  cell: CellValue,
  item: Object | null,
  columnIndex: number,
  rowIndex: number,
  hover: boolean,
  focus: boolean,
  weakFocus: boolean,
  foreignFocus: boolean,
  error: boolean,
  weakError: boolean,
};

const Cell = ({
  cell,
  item,
  columnIndex,
  rowIndex,
  hover,
  focus,
  weakFocus,
  foreignFocus,
  error,
  weakError,
}: Props) => {
  const parentCell = useCell(cell.merged ? cell.merged.from : { x: rowIndex, y: columnIndex });
  const hasPermission = useHasPermissions(parentCell.data?.ownedBy);
  const { dispatch, mutate } = useSheetState();
  const wrapperRef = React.useRef(null);
  const [inputFocus, setInputFocus] = React.useState(false);

  const isReadonly = parentCell.readonly || false;
  const isDisabled =
    parentCell.disabled || !(parentCell.data && parentCell.data.permissions(hasPermission));
  const isInputFocusable = !isReadonly && !isDisabled && !cell.forbidden && !!cell.entity;

  const isTop = !cell.merged || cell.merged.from.x === rowIndex;
  const isBottom = !cell.merged || cell.merged.to.x === rowIndex;

  const size = cell.merged ? cell.merged.to.x - cell.merged.from.x + 1 : 1;

  const readonlyValue = React.useMemo(() => {
    if (cell.empty || cell.forbidden || !cell.entity || !isReadonly) {
      return null;
    }

    if (!cell.computed || !item) {
      return cell.data?.value ?? null;
    }

    return cell.computed(item);
  }, [cell, item, isReadonly]);

  React.useEffect(() => {
    if (focus && isTop) {
      if (wrapperRef.current) {
        wrapperRef.current.focus({
          preventScroll: true,
        });
      }
    } else {
      setInputFocus(false);
    }
  }, [focus, isTop]);

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

  const handleClick = React.useCallback(() => {
    if (!focus) {
      dispatch({
        type: Actions.FOCUS,
        cell: { x: rowIndex, y: columnIndex },
      });
    }
  }, [focus, dispatch, rowIndex, columnIndex]);
  const handleMouseDown = React.useCallback(
    (e: SyntheticEvent<HTMLDivElement>) => {
      if (!isTop) {
        e.preventDefault();
      }
    },
    [isTop]
  );
  const handleMouseEnter = React.useCallback(() => {
    dispatch({
      type: Actions.HOVER,
      cell: { x: rowIndex, y: columnIndex },
    });
  }, [dispatch, rowIndex, columnIndex]);
  const handleKeyDown = React.useCallback(
    (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Enter':
          if (isInputFocusable) {
            setInputFocus(true);
          } else {
            handleFocusDown();
          }
          break;
        case 'Escape':
          setInputFocus(false);
          if (wrapperRef.current) {
            wrapperRef.current.focus({
              preventScroll: true,
            });
          }
          break;
        default:
          break;
      }
    },
    [handleFocusDown, isInputFocusable]
  );

  const handleInputFocus = React.useCallback(() => {
    setInputFocus(true);
  }, []);
  const handleInputBlur = React.useCallback(() => {
    setInputFocus(false);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={CellStyle(
        focus,
        !!parentCell.entity && isReadonly,
        !!parentCell.entity && isDisabled
      )}
      role="presentation"
      tabIndex="-1"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className={CellBorderStyle(
          isTop,
          isBottom,
          hover,
          focus,
          foreignFocus,
          weakFocus,
          error,
          weakError
        )}
      />

      {isTop && inputFocus && <div className={CellShadowStyle(size)} />}

      {(() => {
        if (cell.empty) {
          return null;
        }

        if (cell.forbidden) {
          return <Blackout width="100%" height="100%" />;
        }

        if (!cell.entity) {
          return <div className={CellPlaceholderStyle} />;
        }

        if (isReadonly) {
          return <CellDisplay value={readonlyValue} type={cell.type} entity={cell.entity?.type} />;
        }

        return (
          <CellInput
            value={cell.data?.value ?? null}
            type={cell.type}
            focus={focus}
            inputFocus={inputFocus}
            readonly={isReadonly}
            disabled={isDisabled}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onUp={handleFocusUp}
            onDown={handleFocusDown}
            onUpdate={handleUpdate}
          />
        );
      })()}
    </div>
  );
};

export default React.memo<Props>(Cell);
