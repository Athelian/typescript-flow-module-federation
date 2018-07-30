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
  border: 1.5px solid ${focus ? colors.TEAL : colors.GRAY};
  color: ${colors.GRAY_LIGHT};
  width: ${focus || expand ? '200px' : '40px'};
  padding: 0 5px 0 7px;
  ${transitions.MAIN};
  flex-shrink: 0;
  &:hover {
    width: 200px;
  }
`;

export const InputStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  background: none;
  border: none;
  font-weight: bold;
  padding: 10px 0 10px 10px;
  width: 100%;
  outline: none;
`;

export const ClearButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  padding: 5px;
  &:hover {
    color: ${colors.BLACK};
  }
`;
