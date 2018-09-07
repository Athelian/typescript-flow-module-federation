// @flow
import { css } from 'react-emotion';
import {
  borderRadiuses,
  colors,
  transitions,
  fontSizes,
  shadows,
  presets,
  scrollbars,
} from 'styles/common';
import { type OptionalProps } from './type';

export const DefaultStyleWrapperStyle = ({
  type,
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
}: OptionalProps) => css`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid ${hasError ? colors.RED : 'transparent'};
  ${isFocused && `border-color: ${hasError ? colors.RED : colors.TEAL}`};
  ${borderRadiuses.MAIN};
  background-color: ${disabled ? colors.GRAY_SUPER_LIGHT : '#fff'};
  height: ${height};
  width: ${width};
  min-width: ${width};
  cursor: text;
  ${transitions.MAIN};
  ${forceHoverStyle || isFocused
    ? `${shadows.INPUT};
      & > button {
        opacity: 1;
      }
    `
    : `&:hover {
      ${shadows.INPUT};
      & > button {
        opacity: 1;
      }
    }`};
  & > input,
  > textarea {
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
    font-weight: bold;
    ${fontSizes.MAIN};
    color: ${colors.BLACK};
    padding: 0 5px;
    ${borderRadiuses.MAIN};
    ${presets.ELLIPSIS};
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: ${colors.GRAY_LIGHT};
    }
    ${(type === 'date' || type === 'number') &&
      `
        &::-webkit-outer-spin-button,
        ::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `};
    ${type === 'date' &&
      `
        &:placeholder-shown {
          color: ${colors.GRAY_VERY_LIGHT};
        }
    `};
    ${type === 'textarea' &&
      `
        resize: none;
        ${scrollbars.SMALL};
        overflow: hidden;
        &:hover {
          overflow-x: hidden;
          overflow-y: auto;
        }
      `};
  }
`;

export default DefaultStyleWrapperStyle;
