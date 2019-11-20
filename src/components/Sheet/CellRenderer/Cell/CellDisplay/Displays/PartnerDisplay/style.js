// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses } from 'styles/common';

export const CardStyle: string = css`
  ${layout.HORIZONTAL};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  overflow: hidden;
  border-bottom-right-radius: 0;
  width: 100%;
  min-width: 40px;
  height: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;
