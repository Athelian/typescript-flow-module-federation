// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes } from 'styles/common';

export const CellStyle = (readonly: boolean, disabled: boolean, extended: number) => {
  let backgroundColor = colors.WHITE;
  if (disabled) {
    backgroundColor = 'rgba(0, 0, 0, 0.1)';
  } else if (readonly) {
    backgroundColor = 'rgba(0, 0, 0, 0.025)';
  }

  return css`
    position: relative;
    width: 100%;
    height: ${extended > 0 ? `${(extended + 1) * 30}px` : '100%'};
    ${extended && 'z-index: 2;'}
    box-sizing: border-box;
    background-color: ${backgroundColor};

    &:hover {
      & > div#focuses {
        ${layout.LAYOUT};
      }
    }
  `;
};

export const CellBorderStyle = (focus: boolean, foreignFocus: boolean, weakFocus: boolean) => {
  let border = `
    border-right: 0.5px solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
  `;
  if (focus) {
    border = `border: 2px solid ${colors.TEAL};`;
  } else if (weakFocus) {
    border = `border: 2px solid rgba(17, 209, 166, 0.5);`;
  } else if (foreignFocus) {
    border = `border: 2px solid ${colors.BLUE};`;
  }

  return css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    ${border};

    &:hover {
      ${!focus && !foreignFocus && !weakFocus && 'border: 2px solid rgba(0, 0, 0, 0.1);'}
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
