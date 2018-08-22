// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, transitions, fontSizes, shadows } from 'styles/common';

export const StyledTextInputWrapperStyle = (
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean
) => css`
  display: flex;
  align-items: center;
  border: 1px solid ${hasError ? colors.RED : 'transparent'};
  ${isFocused && `border-color: ${hasError ? colors.RED : colors.TEAL}`};
  padding: 0 5px;
  ${borderRadiuses.MAIN};
  background-color: ${disabled ? colors.GRAY_SUPER_LIGHT : '#fff'};
  height: 30px;
  width: 100%;
  ${transitions.MAIN};
  ${forceHoverStyle || isFocused
    ? shadows.INPUT
    : `&:hover {
      ${shadows.INPUT};
    }`};
`;

export const StyledTextInputStyle = css`
  border: none;
  padding: 0;
  width: 100%;
  height: 100%;
  font-weight: bold;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  &:focus {
    outline: none;
  }
`;
