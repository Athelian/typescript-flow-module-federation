// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import { Blackout } from 'components/Form';
import TextInput from './Inputs/TextInput';
import { CellBorderStyle, CellStyle, FocusesWrapperStyle, FocusStyle } from './style';

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

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (dirtyValue === value) {
        return;
      }

      dispatch({
        type: 'change_value',
        payload: dirtyValue,
      });
    }, 10000);

    return () => {
      clearTimeout(handler);
    };
  }, [dirtyValue, dispatch, value]);

  const handleChange = e => {
    setDirtyValue(e.target.value);
  };

  const handleBlur = () => {
    if (dirtyValue === value) {
      return;
    }

    dispatch({
      type: 'change_value',
      payload: dirtyValue,
    });
  };

  const handleClick = () => {
    dispatch({
      type: 'focus',
    });
  };

  return (
    <div
      className={CellStyle(readonly, disabled, extended)}
      role="presentation"
      onClick={handleClick}
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
        inputs[type]({
          value: dirtyValue,
          readonly: readonly || disabled,
          onBlur: handleBlur,
          onChange: handleChange,
          onKeyDown: () => {},
        })
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
