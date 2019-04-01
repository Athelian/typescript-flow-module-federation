// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';

export const TotalCardWrapperStyle: string = css`
  width: 290px;
  height: 40px;
  position: relative;
  cursor: pointer;
  ${borderRadiuses.MAIN};
`;

export default TotalCardWrapperStyle;
