// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const RemoveButtonStyle = (offset: boolean): string => css`
  position: absolute;
  top: 0;
  height: 55px;
  ${presets.BUTTON};
  ${fontSizes.LARGE};
  color: ${colors.RED};
  z-index: 1;
  opacity: 0;
  ${offset
    ? `
    width: calc(100% + 10px);
    left: -10px;
  `
    : `
    width: calc(100% + 40px);
    left: -20px;
  `};
  & > svg {
    position: relative;
  }
  &:hover {
    opacity: 1;
  }
`;

export const DashedLineStyle: string = css`
  position: absolute;
  left: calc(50% - 2px);
  width: 4px;
  height: 55px;
  border: 2px dashed ${colors.GRAY_LIGHT};
`;
