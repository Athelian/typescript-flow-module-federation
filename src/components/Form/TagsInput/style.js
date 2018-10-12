// @flow
import { css } from 'react-emotion';
import {
  presets,
  layout,
  colors,
  transitions,
  fontSizes,
  scrollbars,
  shadows,
  borderRadiuses,
} from 'styles/common';

export const WrapperStyle = (focused: boolean, disabled: boolean, readonly: boolean): string => css`
  ${layout.HORIZONTAL};
  ${transitions.MAIN};
  background: #fff;
  ${disabled && `background: ${colors.GRAY_SUPER_LIGHT}`};
  ${readonly &&
    `
      border: none;
      cursor: default;
    `};
`;

export const SelectionWrapperStyle: string = css`
  /* display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  & > *:not(:last-child) {
    margin: 6px 10px 6px 0;
  } */
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const RemoveStyle: string = css`
  cursor: pointer;
  color: inherit;
  ${fontSizes.MEDIUM};
`;

export const ExpandButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY};
  cursor: pointer;
  width: 40px;
  &:hover:not([disabled]) {
    color: ${colors.TEAL_DARK};
  }
  &:focus:not([disabled]) {
    color: ${colors.TEAL};
  }
  &[disabled] {
    cursor: default;
  }
`;

export const ArrowDownStyle = (isOpen: boolean): string => css`
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
`;

export const InputStyle = (isHover: boolean): string => css`
  ${layout.HORIZONTAL};
  flex: auto;
  position: relative;
  ${borderRadiuses.MAIN};
  ${isHover && shadows.DROPDOWN};
  input {
    flex: 1;
    color: ${colors.BLACK};
    ${fontSizes.MAIN};
    border: none;
    font-weight: bold;
    padding: 5px 0 5px 8px;
    background-color: transparent;
    width: 80px;
    &:focus {
      outline: none;
    }
  }
`;

export const ListWrapperStyle: string = css`
  ${layout.VERTICAL};
  ${presets.BOX};
  ${scrollbars.SMALL};
  position: absolute;
  width: 100%;
  margin-top: 44px;
  overflow-y: overlay;
  overflow-x: hidden;
  z-index: 5;
  user-select: none;
  max-height: 240px;
  min-width: min-content;
`;

export const ItemStyle = (highlighted: boolean): string => css`
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-weight: bold;
  background-color: ${highlighted ? colors.TEAL : '#fff'};
  ${presets.ELLIPSIS};
  ${transitions.MAIN};
  cursor: pointer;
  height: 40px;
  width: 100%;
  flex-shrink: 0;
`;

export const SelectedWrapperStyle = (highlighted: boolean): string => css`
  ${fontSizes.MAIN};
  color: ${highlighted ? '#fff' : colors.GRAY_LIGHT};
  min-width: 20px;
  margin-right: 3px;
`;
