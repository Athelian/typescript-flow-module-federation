// @flow
import { css } from 'react-emotion';
import { borderRadiuses, presets } from 'styles/common';

export const TotalCardWrapperStyle: string = css`
  ${presets.BUTTON};
  width: 290px;
  height: 40px;
  position: relative;
  ${borderRadiuses.MAIN};
`;

export default TotalCardWrapperStyle;
