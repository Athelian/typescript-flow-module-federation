// @flow
import { css } from 'react-emotion';
import { shadows, colors } from 'styles/common';

export const CellStyle = (focus: boolean, readonly: boolean, disabled: boolean) => {
  let backgroundColor = colors.WHITE;
  if (disabled) {
    backgroundColor = 'rgba(0, 0, 0, 0.1)';
  } else if (readonly) {
    backgroundColor = 'rgba(0, 0, 0, 0.025)';
  }

  return css`
    position: relative;
    width: 100%;
    height: 100%;
    ${focus && 'z-index: 1'};
    background-color: ${backgroundColor};
    overflow: hidden;
  `;
};

export const CellBorderStyle = (
  isTop: boolean,
  isBottom: boolean,
  hover: boolean,
  focus: boolean,
  foreignFocus: boolean,
  weakFocus: boolean,
  error: boolean,
  weakError: boolean
) => {
  let border = `
    border-right: 0.5px solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
  `;

  if (focus) {
    border = `border: 2px solid ${colors.TEAL};`;
  } else if (weakFocus) {
    border = `border: 2px solid rgba(17, 209, 166, 0.5);`;
  } else if (error) {
    border = `border: 2px solid ${colors.RED};`;
  } else if (weakError) {
    border = `border: 2px solid rgba(239, 72, 72, 0.5);`;
  } else if (foreignFocus) {
    border = `border: 2px solid ${colors.ORANGE};`;
  } else if (hover) {
    border = `border: 2px solid rgba(0, 0, 0, 0.1);`;
  }

  return css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    ${border};
    ${!isTop && `border-top: none`};
    ${!isBottom && `border-bottom: none`};
    z-index: ${focus ? '-1' : '1'};
  `;
};

export const CellShadowStyle = (size: number) => css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${-(size - 1) * 30}px;
  ${shadows.INPUT};
  z-index: -2;
`;

export const CellPlaceholderStyle = css`
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.03),
    rgba(0, 0, 0, 0.03) 5px,
    #fff 5px,
    #fff 10px
  );
`;
