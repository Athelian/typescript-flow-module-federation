// @flow
import { css } from 'react-emotion';
import {
  borderRadiuses,
  colors,
  fontSizes,
  presets,
  transitions,
  shadows,
  layout,
} from 'styles/common';

export const SelectInputStyle = (isOpen: boolean): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.MAIN};
  border: 1px solid ${isOpen ? colors.TEAL : 'rgba(0, 0, 0, 0.1)'};
  width: 100%;
  height: 30px;
  padding: 0 5px;

  &:hover,
  &:focus {
    ${shadows.INPUT};
  }

  & > input {
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    color: ${colors.BLACK};
    background: transparent;
    width: 100%;
    line-height: 18px;
    font-weight: bold;
    &::placeholder {
      color: ${colors.GRAY_LIGHT};
    }
  }
`;

export const ArrowDownStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  ${fontSizes.SMALL};
  color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;
