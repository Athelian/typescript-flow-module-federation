// @flow
import { css } from 'react-emotion';
import {
  presets,
  layout,
  colors,
  transitions,
  fontSizes,
  scrollbars,
  borderRadiuses,
} from 'styles/common';

export const WrapperStyle = (focused: boolean, disabled: boolean, editable: boolean): string => css`
  ${layout.HORIZONTAL};
  ${transitions.MAIN};
  min-height: 30px;
  ${disabled && `background: ${colors.GRAY_SUPER_LIGHT}`};
  ${!editable &&
    `
      border: none;
      cursor: default;
    `};
`;

export const SelectionWrapperStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  grid-gap: 10px;
`;

export const RemoveStyle: string = css`
  cursor: pointer;
  color: inherit;
  ${fontSizes.MEDIUM};
`;

export const InputStyle = (width: string): string => css`
  display: flex;
  align-items: center;
  position: relative;
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};
  width: ${width};
  white-space: nowrap;
  overflow-x: auto;
  ${scrollbars.SMALL};
  padding: 0 0 0 5px;
  & > div {
    margin-right: 5px;
  }
  input {
    color: ${colors.BLACK};
    ${fontSizes.MAIN};
    border: none;
    font-weight: bold;
    padding: 5px 0 5px 0;
    background-color: transparent;
    min-width: 80px;
    flex: 1;
    &:focus {
      outline: none;
    }
  }
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
