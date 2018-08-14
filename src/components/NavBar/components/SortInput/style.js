// @flow
import { css } from 'react-emotion';
import {
  layout,
  colors,
  borderRadiuses,
  fontSizes,
  transitions,
  presets,
  shadows,
} from 'styles/common';

export const WrapperStyle = css`
  ${presets.BUTTON};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.MAIN};
  position: relative;
  background: #fff;
  overflow: hidden;
  width: 150px;
  height: 30px;
  align-items: center;
  padding: 0 0 0 5px;
  ${transitions.MAIN};
  ${shadows.NAV_BUTTON};
  ${fontSizes.MAIN};

  input {
    border: none;
    outline: none;
    color: ${colors.BLACK};
    cursor: pointer;
  }
`;

export const SelectStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  flex: 1;
  height: 20px;
  border-right: 1px solid ${colors.GRAY_VERY_LIGHT};
  padding: 0 5px 0 0;
  ${presets.ELLIPSIS};
`;

export const ButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  &:hover,
  &:focus {
    color: ${colors.TEAL};
  }
`;

export const OptionWrapperStyle = css`
  ${presets.BOX};
  ${shadows.DROPDOWN};
  margin-top: 5px;
`;

export const OptionItemStyle = (onHover: boolean, selected: boolean) => css`
  background: ${onHover ? colors.GRAY_SUPER_LIGHT : '#fff'};
  ${presets.BUTTON};
  justify-content: flex-start;
  padding: 0 5px;
  color: ${selected ? colors.TEAL : colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  flex: 1;
  height: 30px;
  width: 150px;
  ${presets.ELLIPSIS};
`;
