// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses } from 'styles/common';

export const WrapperStyle = css`
  padding: 35px 20px;
  background-color: #fff;
  color: ${colors.GRAY};
  ${borderRadiuses.MAIN};
`;

export default WrapperStyle;
