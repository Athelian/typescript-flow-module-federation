// @flow
import * as React from 'react';
import { useHasPermissions } from 'components/Context/Permissions';
import { Blackout } from 'components/Form';
import type { CellValue } from '../../SheetState';
import { useSheetState } from '../../SheetState';
import { Actions } from '../../SheetState/contants';
import CellInput from './CellInput';
import { CellStyle, CellBorderStyle, CellPlaceholderStyle } from './style';

type Props = {
  cell: CellValue,
  columnIndex: number,
  rowIndex: number,
  focus: boolean,
  weakFocus: boolean,
  foreignFocus: boolean,
  error: boolean,
  weakError: boolean,
};

const Cell = ({
  cell,
  columnIndex,
  rowIndex,
  focus,
  weakFocus,
  foreignFocus,
  error,
  weakError,
}: Props) => {
  const hasPermission = useHasPermissions(cell?.entity?.ownedBy);
  const { dispatch, mutate } = useSheetState();
  const wrapperRef = React.useRef(null);
  const [inputFocus, setInputFocus] = React.useState(false);

  React.useEffect(() => {
    if (focus) {
      if (wrapperRef.current) {
        wrapperRef.current.focus({
          preventScroll: true,
        });
      }
    } else {
      setInputFocus(false);
    }
  }, [focus]);

  const handleClick = React.useCallback(() => {
    if (!focus) {
      dispatch({
        type: Actions.FOCUS,
        cell: { x: rowIndex, y: columnIndex },
      });
    }
  }, [focus, dispatch, rowIndex, columnIndex]);
  const handleKeyDown = React.useCallback(
    (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Enter':
          setInputFocus(true);
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
    [setInputFocus]
  );

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

  const handleInputFocus = () => {
    setInputFocus(true);
  };
  const handleInputBlur = () => {
    setInputFocus(false);
  };

  const isReadonly = cell.readonly || false;
  const isDisabled = cell.disabled || !(cell.entity && cell.entity.permissions(hasPermission));

  return (
    <div
      ref={wrapperRef}
      className={CellStyle(
        focus,
        !!cell.entity && isReadonly,
        !!cell.entity && isDisabled,
        cell.extended || 0
      )}
      role="presentation"
      tabIndex="-1"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={CellBorderStyle(focus, foreignFocus, weakFocus, inputFocus, error, weakError)}
      />

      {(() => {
        if (cell.forbidden) {
          return <Blackout width="100%" height="100%" />;
        }

        if (!cell.entity) {
          return <div className={CellPlaceholderStyle} />;
        }

        return (
          <CellInput
            value={cell.data?.value || null}
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

export default Cell;
