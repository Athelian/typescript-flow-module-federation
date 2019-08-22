// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const CellStyle = (
  focus: boolean,
  weakFocus: boolean,
  readonly: boolean,
  disabled: boolean,
  empty: boolean
) => {
  let backgroundColor = colors.WHITE;
  if (empty) {
    backgroundColor = 'rgba(50, 120, 19, 0.1)';
  } else if (disabled) {
    backgroundColor = 'rgba(0, 0, 0, 0.1)';
  } else if (readonly) {
    backgroundColor = 'rgba(0, 0, 0, 0.025)';
  }

  return css`
    width: 100%;
    height: 100%;
    border-right: 0.5px solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    background-color: ${backgroundColor};
    ${weakFocus && `border: 2px solid rgba(17, 209, 166, 0.5);`}
    ${focus && `border: 2px solid ${colors.TEAL};`}

    ${!empty &&
      !focus &&
      !weakFocus &&
      `&:hover {
      border: 2px solid rgba(0, 0, 0, 0.1);
    }`}
  `;
};
