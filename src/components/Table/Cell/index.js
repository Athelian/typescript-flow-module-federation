// @flow
import * as React from 'react';
import { CellStyle } from './style';

type Props = {
  value: any,
  focus: boolean,
  weakFocus: boolean,
  readonly: boolean,
  empty: boolean,
  forbidden: boolean,
  permitted: boolean,
  dispatch: ({ type: string, state?: any }) => void,
};

const Cell = React.memo(
  ({ value, focus, weakFocus, readonly, empty, forbidden, permitted, dispatch }: Props) => {
    const disabled = forbidden || !permitted;

    const handleClick = () => {
      dispatch({
        type: 'focus',
      });
    };

    return (
      <div
        className={CellStyle(focus, weakFocus, readonly, disabled, empty)}
        role="presentation"
        onClick={handleClick}
      >
        {forbidden ? 'blackout' : value}
      </div>
    );
  }
);

Cell.defaultProps = {
  value: null,
  focus: false,
  weakFocus: false,
  readonly: false,
  empty: false,
  forbidden: false,
  permitted: false,
};

export default Cell;
