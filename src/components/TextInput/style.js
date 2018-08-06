// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes } from 'styles/common';

export const InputStyle = (isError: boolean) => css`
  color: ${colors.BLACK};
  border-radius: 2px;
  border: none;
  border-bottom: 2px solid ${isError ? colors.RED : colors.GRAY_VERY_LIGHT};
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 10px;
  background: #fff;
  height: 40px;
  ${transitions.MAIN};
  &[disabled] {
    background: ${colors.GRAY_SUPER_LIGHT};
  }
  &[readonly] {
    padding: 10px 0;
    border: none;
    cursor: default;
    &:focus {
      border-color: ${colors.GRAY_VERY_LIGHT};
    }
  }
  &:focus {
    border-color: ${isError ? colors.RED : colors.TEAL};
    outline: none;
  }
`;

export default InputStyle;
