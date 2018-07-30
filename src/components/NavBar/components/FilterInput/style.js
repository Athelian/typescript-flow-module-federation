// @flow
import { css } from 'react-emotion';
import {
  colors,
  layout,
  presets,
  borderRadiuses,
  fontSizes,
  shadows,
  transitions,
} from 'styles/common';

export const WrapperStyle = css`
  position: relative;
  margin-left: 16px;
`;

export const ButtonStyle = css`
  ${presets.BUTTON};
  ${transitions.MAIN};
  ${fontSizes.MAIN};
  position: relative;
  color: ${colors.GRAY_LIGHT};
  width: 30px;
  height: 30px;
  outline: none;
  &:hover {
  }
`;

export const ActiveStyle = css`
  position: absolute;
  border-radius: 50%;
  background-color: ${colors.RED};
  color: #fff;
  font-size: 11px;
  padding: 2px 4px;
  width: 15px;
  height: 15px;
  top: -1px;
  right: -1px;
`;

export const ContentStyle = (fixed: boolean, isOpen: boolean, isExpanded: boolean) => css`
  ${presets.BOX};
  ${transitions.MAIN};
  ${shadows.NAV_BUTTON};
  ${!isOpen && `display: none`};
  ${fixed
    ? `
  position: fixed;
  top: 70px;
  left: ${isExpanded ? '220px' : '70px'};
  right: 20px;
  `
    : `
    top: 50px;
    position: absolute;
    width: min-content;
    z-index: 100;
  `};
  padding: 10px;
`;

export const FormStyle = css`
  ${layout.VERTICAL};
`;

export const ButtonsWrapper = css`
  ${layout.HORIZONTAL};
  margin-top: 20px;
  justify-content: flex-end;
`;

export const ResetButtonStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  color: ${colors.TEAL};
  padding: 5px 10px;
  margin-right: 20px;
  text-align: center;
  &:hover {
    background-color: ${colors.GRAY_VERY_LIGHT};
  }
`;

export const SubmitButtonStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  color: #fff;
  background-color: ${colors.TEAL};
  ${fontSizes.SMALL};
  ${transitions.MAIN};
  padding: 5px 10px;
  text-align: center;
  &:hover {
    background-color: ${colors.BLUE_DARK};
  }
`;
