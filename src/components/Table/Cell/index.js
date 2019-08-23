// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import { CellStyle, FocusesWrapperStyle, FocusStyle } from './style';

type Props = {
  value: any,
  focus: boolean,
  weakFocus: boolean,
  foreignFocuses: Array<{ id: string, firstName: string, lastName: string }>,
  readonly: boolean,
  empty: boolean,
  forbidden: boolean,
  permitted: boolean,
  onFirstRow: boolean,
  dispatch: ({ type: string, payload?: any }) => void,
};

const Cell = ({
  value,
  focus,
  weakFocus,
  foreignFocuses,
  readonly,
  empty,
  forbidden,
  permitted,
  onFirstRow,
  dispatch,
}: Props) => {
  const disabled = forbidden || !permitted;

  const handleClick = () => {
    dispatch({
      type: 'focus',
    });
  };

  return (
    <div
      className={CellStyle(focus, foreignFocuses.length > 0, weakFocus, readonly, disabled, empty)}
      role="presentation"
      onClick={handleClick}
    >
      {foreignFocuses.length > 0 && (
        <div id="focuses" className={FocusesWrapperStyle(onFirstRow)}>
          {foreignFocuses.map(ff => (
            <span key={ff.id} className={FocusStyle(onFirstRow)}>
              <FormattedName firstName={ff.firstName} lastName={ff.lastName} />
            </span>
          ))}
        </div>
      )}
      {forbidden ? 'blackout' : value}
    </div>
  );
};

Cell.defaultProps = {
  value: null,
  focus: false,
  weakFocus: false,
  readonly: false,
  empty: false,
  forbidden: false,
  permitted: false,
  onFirstRow: false,
};

export default React.memo<Props>(Cell);
