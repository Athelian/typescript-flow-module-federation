// @flow
import { css } from 'react-emotion';

import { borderRadiuses, colors, fontSizes } from 'styles/common';

export const SelectInputStyle = (align: 'left' | 'right' | 'center'): string => css`
  cursor: pointer;
  text-align: ${align};
`;

export const WrapperStyle: string = css`
  display: flex;
  align-items: center;
  cursor: text;

  & > input {
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
    line-height: 20px;
    background: none;
    ${borderRadiuses.MAIN};
    color: ${colors.BLACK};
    ${fontSizes.MAIN};
    font-weight: bold;
  }
  &:focus {
    outline: none;
  }
`;

export default SelectInputStyle;
