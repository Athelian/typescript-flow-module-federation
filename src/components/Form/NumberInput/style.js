// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes } from 'styles/common';

export const NumberInputStyle = (isError: boolean, width: ?string, align: string) => css`
  color: ${colors.BLACK};
  border-radius: 2px;
  border: none;
  border-bottom: 2px solid ${isError ? colors.RED : colors.GRAY_VERY_LIGHT};
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 10px;
  background: #fff;
  height: 40px;
  width: ${width || '100%'};
  text-align: ${align};
  ${transitions.MAIN};
  &[disabled] {
    background: ${colors.GRAY_SUPER_LIGHT};
  }
  &[readonly] {
    border: none;
    &:focus {
      border-color: ${colors.GRAY_VERY_LIGHT};
    }
  }
  &:focus {
    border-color: ${isError ? colors.RED : colors.TEAL};
    outline: none;
  }
`;

export const FullEditNumberInputStyle = (isError: boolean) => css`
  color: ${colors.BLACK};
  border-radius: 2px;
  border: none;
  border-bottom: 2px solid ${isError ? colors.RED : colors.GRAY_VERY_LIGHT};
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 10px;
  background: #fff;
  height: 40px;
  width: 90%;
  ${transitions.MAIN};
  &[disabled] {
    background: ${colors.GRAY_SUPER_LIGHT};
  }
  &[readonly] {
    border: none;
    &:focus {
      border-color: ${colors.GRAY_VERY_LIGHT};
    }
  }
  &:focus {
    border-color: ${isError ? colors.RED : colors.TEAL};
    outline: none;
  }
`;
