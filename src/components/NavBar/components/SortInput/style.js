// @flow
import { css } from 'react-emotion';
import {
  layout,
  colors,
  borderRadiuses,
  shadows,
  fontSizes,
  transitions,
  presets,
} from 'styles/common';

export const WrapperStyle = (focus: boolean) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.BUTTON};
  ${shadows.NAV_BUTTON};
  position: relative;
  background: #fff;
  overflow: hidden;
  border: 1.5px solid ${focus ? colors.TEAL : colors.GRAY};
  color: ${colors.GRAY_LIGHT};
  min-width: 200px;
  padding-left: 10px;
  box-sizing: content-box;
  ${transitions.MAIN};
`;

export const ButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY};
  padding: 0px 10px 0px 5px;
  height: 100%;
  &:hover {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
  &:focus {
    background-color: ${colors.TEAL};
    color: #fff;
    border: none;
  }
`;

export const InputStyle = css`
  color: ${colors.BLACK};
  background: none;
  border: none;
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 10px 0 10px 10px;
  width: 100%;
  outline: none;
  cursor: pointer;
`;
