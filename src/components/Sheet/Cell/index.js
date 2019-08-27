// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import { Blackout } from 'components/Form';
import { Actions } from '../SheetState/contants';
import TextInput from './Inputs/TextInput';
import {
  CellBorderStyle,
  CellStyle,
  FocusesWrapperStyle,
  FocusStyle,
  InputWrapperStyle,
} from './style';

type Props = {
  value: any,
  type: string,
  focus: boolean,
  weakFocus: boolean,
  foreignFocuses: Array<{ id: string, firstName: string, lastName: string }>,
  readonly: boolean,
  forbidden: boolean,
  disabled: boolean,
  onFirstRow: boolean,
  extended: number,
  dispatch: ({ type: string, payload?: any }) => void,
};

const inputs = {
  text: TextInput,
};

const Cell = ({
  value,
  type,
  focus,
  weakFocus,
  foreignFocuses,
  readonly,
  forbidden,
  disabled,
  onFirstRow,
  extended,
  dispatch,
}: Props) => {
  const [dirtyValue, setDirtyValue] = React.useState<any>(value);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (dirtyValue === value) {
      return () => {};
    }

    const handler = setTimeout(() => {
      dispatch({
        type: Actions.CHANGE_VALUE,
        payload: dirtyValue,
      });
    }, 10000);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, dirtyValue]);

  const handleKeyDown = (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Enter':
        if (inputRef.current) {
          inputRef.current.focus();
        }
        break;
      case 'Escape':
        if (inputRef.current) {
          inputRef.current.blur();
        }
        break;
      default:
        break;
    }
  };

  const handleClick = () => {
    dispatch({
      type: Actions.FOCUS,
    });
  };

  const handleInputChange = e => {
    setDirtyValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (dirtyValue === value) {
      return;
    }

    dispatch({
      type: Actions.CHANGE_VALUE,
      payload: dirtyValue,
    });
  };

  const handleInputKeyDown = (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowRight':
      case 'ArrowLeft':
        e.stopPropagation();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={CellStyle(readonly, disabled, extended)}
      role="presentation"
      tabIndex="-1"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={CellBorderStyle(focus, foreignFocuses.length > 0, weakFocus)} />
      {foreignFocuses.length > 0 && (
        <div id="focuses" className={FocusesWrapperStyle(onFirstRow)}>
          {foreignFocuses.map(ff => (
            <span key={ff.id} className={FocusStyle(onFirstRow)}>
              <FormattedName firstName={ff.firstName} lastName={ff.lastName} />
            </span>
          ))}
        </div>
      )}

      {forbidden ? (
        <Blackout width="100%" height="100%" />
      ) : (
        <div className={InputWrapperStyle(focus)}>
          {React.createElement(inputs[type], {
            ref: inputRef,
            value: dirtyValue,
            readonly: readonly || disabled,
            onBlur: handleInputBlur,
            onChange: handleInputChange,
            onKeyDown: handleInputKeyDown,
          })}
        </div>
      )}
    </div>
  );
};

Cell.defaultProps = {
  value: null,
  type: 'text',
  focus: false,
  weakFocus: false,
  readonly: false,
  forbidden: false,
  disabled: false,
  onFirstRow: false,
  extended: 0,
};

export default React.memo<Props>(Cell);
