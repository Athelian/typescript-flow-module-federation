// @flow
import { css } from 'react-emotion';

import { colors } from 'styles/common';

export const DisabledCellStyle: string = css`
  width: 190px;
  height: 25px;
  padding: 5px;
  margin: 10px;
  font-size: 11px;
  color: #fff;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  border: 1px solid #000;
`;

export default DisabledCellStyle;
