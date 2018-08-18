// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, borderRadiuses } from 'styles/common';

export const InputStyle = (
  isError: boolean,
  hasHoverStyle: boolean,
  width: ?string,
  align: 'left' | 'right' | 'center'
) => css`
  color: ${colors.BLACK};
  border: 2px solid ${isError ? colors.RED : 'transparent'};
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 0 8px;
  ${borderRadiuses.MAIN};
  background: #fff;
  height: 30px;
  width: ${width || '100%'};
  text-align: ${align};
  ${transitions.MAIN};
  ${hasHoverStyle && 'box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2)'};
  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
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

export default InputStyle;
