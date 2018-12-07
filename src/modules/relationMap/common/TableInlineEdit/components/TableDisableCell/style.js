// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';

export const DisabledCellStyle: string = css`
  width: 200px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.1);
  ${borderRadiuses.MAIN};
`;

export default DisabledCellStyle;
