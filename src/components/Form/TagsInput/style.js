// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, transitions, fontSizes, scrollbars } from 'styles/common';

function bottomColor(isError, focused) {
  if (isError) return colors.RED;

  return focused ? colors.TEAL : colors.GRAY_VERY_LIGHT;
}

export const WrapperStyle = (
  focused: boolean,
  disabled: boolean,
  readonly: boolean,
  isError: boolean
) => css`
  ${layout.HORIZONTAL};
  ${transitions.MAIN};
  border-radius: 2px;
  border-bottom: 2px solid ${bottomColor(isError, focused)};
  background: #fff;
  ${disabled && `background: ${colors.GRAY_SUPER_LIGHT}`};
  ${readonly &&
    `
      border: none;
      cursor: default;
    `};
`;

export const SelectionWrapperStyle = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  & > *:not(:last-child) {
    margin: 6px 10px 6px 0;
  }
`;

export const RemoveStyle = css`
  cursor: pointer;
  color: inherit;
  ${fontSizes.MEDIUM};
`;

export const ExpandButtonStyle = css`
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

export const ArrowDownStyle = (isOpen: boolean) => css`
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
`;

export const InputStyle = css`
  ${layout.HORIZONTAL};
  flex: auto;
  position: relative;
  input {
    flex: 1;
    color: ${colors.BLACK};
    ${fontSizes.MAIN};
    border: none;
    font-weight: bold;
    padding: 10px 0;
    background-color: transparent;
    width: 80px;
    &:focus {
      outline: none;
    }
  }
`;

export const ListWrapperStyle = css`
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

export const ItemStyle = (highlighted: boolean) => css`
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

export const SelectedWrapperStyle = (highlighted: boolean) => css`
  ${fontSizes.MAIN};
  color: ${highlighted ? '#fff' : colors.GRAY_LIGHT};
  min-width: 20px;
  margin-right: 3px;
`;
