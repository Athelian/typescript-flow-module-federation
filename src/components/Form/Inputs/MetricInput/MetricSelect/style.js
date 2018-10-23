// @flow
import { css } from 'react-emotion';

import { borderRadiuses, colors, fontSizes } from 'styles/common';

export const SelectInputStyle = (align: 'left' | 'right' | 'center'): string => css`
  cursor: pointer;
  text-align: ${align};
`;

type MetricSelectWrapperStyleProps = {
  width: string,
  height: string,
};

export const MetricSelectWrapperStyle = ({
  width,
  height,
}: MetricSelectWrapperStyleProps): string => css`
  display: flex;
  align-items: center;
  cursor: text;
  width: ${width};
  height: ${height};
  & > input {
    border: none;
    padding: 0px 5px 0px 0px;
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
