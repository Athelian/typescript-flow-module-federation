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
import { type OptionalProps as CommonOptionalProps } from './type';

type OptionalProps = CommonOptionalProps & {
  transparent?: boolean,
};

export const DefaultStyleWrapperStyle = ({
  type,
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  transparent,
}: OptionalProps): string => css`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid ${hasError ? colors.RED : 'rgba(0, 0, 0, 0.1)'};
  ${isFocused && `border-color: ${hasError ? colors.RED : colors.TEAL}`};
  ${borderRadiuses.MAIN};
  background-color: ${transparent ? colors.TRANSPARENT : colors.WHITE};
  background-color: ${disabled && 'rgba(0, 0, 0, 0.1)'};
  height: ${height};
  width: ${width};
  flex: 1;
  max-width: ${width};
  cursor: text;
  &:focus {
    border-color: ${hasError ? colors.RED : colors.TEAL};
  }
  ${type === 'button' && 'cursor: pointer'};
  ${transitions.MAIN};
  ${!disabled &&
    (forceHoverStyle || isFocused
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
    }`)};
  & > input {
    ${presets.ELLIPSIS};
  }
  & > input,
  > textarea {
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
    line-height: 20px;
    padding: 0 4px;
    background: none;
    ${borderRadiuses.MAIN};
    ${type === 'label'
      ? `
      color: ${colors.GRAY_DARK};
      ${fontSizes.SMALL};
      letter-spacing: 2px;
      text-transform: uppercase;
    `
      : `
      color: ${colors.BLACK};
      ${fontSizes.MAIN};
      font-weight: bold;
    `};
    &:focus {
      outline: none;
      border-color: ${hasError ? colors.RED : colors.TEAL};
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
        overflow-x: hidden;
        overflow-y: auto;
      `};
    ${type === 'max-textarea' &&
      `
      resize: none;
      overflow: auto;
    `};
  }
`;

export default DefaultStyleWrapperStyle;
