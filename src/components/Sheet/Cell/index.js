// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import { Display } from 'components/Form';
import { CellBorderStyle, CellStyle, FocusesWrapperStyle, FocusStyle } from './style';

type Props = {
  value: any,
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

const Cell = ({
  value,
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

      {readonly || disabled || forbidden ? (
        <Display height="30px" blackout={forbidden}>
          {value}
        </Display>
      ) : (
        value
      )}
    </div>
  );
};

Cell.defaultProps = {
  value: null,
  focus: false,
  weakFocus: false,
  readonly: false,
  forbidden: false,
  disabled: false,
  onFirstRow: false,
  extended: 0,
};

export default React.memo<Props>(Cell);
