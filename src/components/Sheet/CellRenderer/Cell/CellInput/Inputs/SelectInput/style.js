// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets, transitions } from 'styles/common';

export const SelectInputStyle = (isOpen: boolean): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${presets.BUTTON};
  width: 100%;
  height: 30px;

  & > span {
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    color: ${colors.BLACK};
    text-align: left;
    font-weight: bold;
    padding: 0 5px;
    flex: 1;
  }

  & > i {
    ${transitions.EXPAND};
    ${fontSizes.SMALL};
    color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
    height: 100%;
    margin-right: 5px;
  }

  &:focus > i {
    color: ${colors.TEAL};
  }
`;

export const SelectOptionStyle = (highlighted: boolean, selected: boolean): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${selected ? colors.TEAL : colors.BLACK};
  background: ${highlighted ? colors.GRAY_SUPER_LIGHT : colors.WHITE};
  width: 100%;
  height: 100%;
  font-weight: bold;
  padding: 0 5px;
`;
