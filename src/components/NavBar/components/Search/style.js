// @flow
import { css } from 'react-emotion';
import {
  layout,
  borderRadiuses,
  transitions,
  shadows,
  fontSizes,
  colors,
  presets,
} from 'styles/common';

export const SearchStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.BUTTON};
  ${transitions.MAIN};
  ${shadows.NAV_BUTTON};
  background: #fff;
  width: 200px;
  height: 30px;
`;

export const InputStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  background: none;
  border: none;
  font-weight: bold;
  outline: none;
  height: 30px;
  flex: 1;
`;

export const IconStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ClearButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;
