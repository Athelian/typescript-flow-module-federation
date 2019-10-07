// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, presets, layout } from 'styles/common';

export const SelectTransportTypeStyle = css`
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  ${fontSizes.MAIN};
  color: ${colors.GRAY};
  min-width: 30px;
`;

export const ArrowDownStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  ${fontSizes.SMALL};
  opacity: ${isOpen ? 1 : 0};
  color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
  height: 100%;
  cursor: pointer;
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;

export const OptionStyle = (highlighted: boolean, selected: boolean): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${selected ? colors.TEAL : colors.BLACK};
  background: ${highlighted ? colors.GRAY_SUPER_LIGHT : colors.WHITE};
  font-weight: bold;
  height: 100%;

  & > span {
    flex: 1;
    padding: 0 5px;
  }
`;
