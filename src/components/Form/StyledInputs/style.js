// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, transitions, fontSizes, shadows, presets } from 'styles/common';

export const StyledInputWrapperStyle = (
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string
) => css`
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
  ${transitions.MAIN};
  ${forceHoverStyle || isFocused
    ? shadows.INPUT
    : `&:hover {
      ${shadows.INPUT};
    }`};
`;

export const StyledInputStyle = css`
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
`;
