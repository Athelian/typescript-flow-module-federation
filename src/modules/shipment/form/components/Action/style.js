// @flow
import { css } from 'react-emotion';
import { colors, presets, borderRadiuses, fontSizes, shadows } from 'styles/common';

export const ActionOverlayWrapperStyle: string = css`
  ${presets.BUTTON};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 0 0 10px;
  z-index: 2;
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    & > div {
      opacity: 1;
    }
  }
`;

export const ActionStyle = (disabled: boolean): string => css`
  ${presets.BUTTON};
  opacity: 0;
  color: ${colors.WHITE};
  background-color: ${disabled ? colors.GRAY_DARK : colors.TEAL};
  ${borderRadiuses.MAIN};
  width: 185px;
  padding: 20px;
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  text-align: center;
  ${shadows.INPUT};
`;
