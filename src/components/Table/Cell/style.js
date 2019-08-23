// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes } from 'styles/common';

export const CellStyle = (
  focus: boolean,
  foreignFocus: boolean,
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

  let border = `
    border-right: 0.5px solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
  `;
  if (focus) {
    border = `border: 2px solid ${colors.TEAL};`;
  } else if (foreignFocus) {
    border = `border: 2px solid ${colors.BLUE};`;
  } else if (weakFocus) {
    border = `border: 2px solid rgba(17, 209, 166, 0.5);`;
  }

  return css`
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: ${backgroundColor};
    ${border}

    &:hover {
      ${!empty && !focus && !foreignFocus && !weakFocus && 'border: 2px solid rgba(0, 0, 0, 0.1);'}
      & > div#focuses {
        ${layout.LAYOUT};
      }
    }
  `;
};

export const FocusesWrapperStyle = (onFirstRow: boolean) => css`
  ${layout.HORIZONTAL};
  display: none;
  position: absolute;
  ${onFirstRow ? 'bottom: -16px;' : 'top: -16px;'}
  left: -2px;
  z-index: 4;
`;

export const FocusStyle = (onFirstRow: boolean) => css`
  background-color: ${colors.BLUE};
  border-radius: ${onFirstRow ? '0px 0px 5px 5px' : '5px 5px 0px 0px'};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  line-height: 15px;
  padding: 0 5px;
`;
