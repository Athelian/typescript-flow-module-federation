// @flow
import { css } from 'react-emotion';
import { colors, presets, borderRadiuses, fontSizes } from 'styles/common';

export const BatchQuantityHelperWandStyle: string = css`
  position: absolute;
  top: 0;
  right: 0;
  ${presets.BUTTON};
  height: 26px;
  width: 26px;
  flex-shrink: 0;
  background-color: ${colors.BATCH};
  ${borderRadiuses.MAIN};
  color: rgba(255, 255, 255, 0.5);
  &:hover {
    color: ${colors.WHITE};
  }
`;

export const BatchQuantityHelperWrapperStyle: string = css`
  position: absolute;
  display: flex;
  top: 0;
  right: 0;
  width: 200px;
  height: 26px;
  background-color: ${colors.WHITE};
  align-items: center;
  justify-content: space-between;
`;

export const BatchQuantityHelperButtonStyle: string = css`
  ${presets.BUTTON};
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  height: 26px;
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  padding: 0 7px;
  flex: 1;
  min-width: min-content;
  flex-shrink: 0;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;
