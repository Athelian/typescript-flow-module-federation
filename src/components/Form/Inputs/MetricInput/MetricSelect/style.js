// @flow
import { css } from 'react-emotion';

import { borderRadiuses, colors, fontSizes } from 'styles/common';

export const SelectInputStyle = (align: 'left' | 'right' | 'center'): string => css`
  cursor: pointer;
  text-align: ${align};
`;

export const MetricSelectWrapperStyle: string = css`
  display: flex;
  align-items: center;
  cursor: text;

  & > input {
    border: none;
    padding: 0px 5px 0px 0px;
    width: 20px;
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
