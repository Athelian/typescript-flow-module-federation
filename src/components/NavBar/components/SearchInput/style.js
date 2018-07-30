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

export const WrapperStyle = (focus: boolean, expand: boolean) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  position: relative;
  overflow: hidden;
  background: #fff;
  ${borderRadiuses.BUTTON};
  ${shadows.NAV_BUTTON};
  color: ${colors.GRAY_LIGHT};
  width: ${focus || expand ? '200px' : '40px'};
  height: 30px;
  margin-left: 16px;
  ${fontSizes.MAIN};
  box-sizing: border-box;
  ${transitions.MAIN};
  flex-shrink: 0;

  &:hover {
    width: 200px;
  }

  & > svg {
    ${layout.HORIZONTAL};
    ${layout.CENTER};
    min-width: 30px;
  }
`;

export const InputStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  background: none;
  border: none;
  font-weight: bold;
  width: 100%;
  outline: none;
`;

export const ClearButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  padding: 5px;
  outline: none;
  &:hover {
    color: ${colors.BLACK};
  }
`;
