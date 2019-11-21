// @flow
import { css } from 'react-emotion';
import {
  presets,
  fontSizes,
  colors,
  borderRadiuses,
  scrollbars,
  shadows,
  transitions,
} from 'styles/common';

export const TextAreaInputButtonStyle: string = css`
  width: 100%;
  cursor: pointer;
`;

export const TextAreaPlaceholderStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.GRAY_LIGHT};
  ${presets.ELLIPSIS};
  padding: 5px;
`;

export const TextAreaInputDialogWrapperStyle: string = css`
  padding: 20px;
  height: 340px;
`;

export const TextAreaInputStyle: string = css`
  width: 400px;
  height: 300px;
  line-height: 20px;
  padding: 0 4px;
  background: none;
  ${borderRadiuses.MAIN};
  resize: none;
  ${scrollbars.SMALL};
  overflow-x: hidden;
  overflow-y: auto;
  ${transitions.MAIN};
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0;
  &:hover {
    ${shadows.INPUT};
  }
  &:focus {
    outline: none;
    ${shadows.INPUT};
    border-color: ${colors.TEAL};
  }
  &::placeholder {
    color: ${colors.GRAY_LIGHT};
  }
`;
