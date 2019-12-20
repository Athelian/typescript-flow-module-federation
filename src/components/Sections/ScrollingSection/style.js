// @flow
import { css } from 'react-emotion';
import { borderRadiuses, shadows, colors, scrollbars } from 'styles/common';

export const ScrollingSectionWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  ${shadows.WATERFALL};
  width: 880px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const ScrollingSectionBodyStyle: string = css`
  position: relative;
  display: flex;
  align-items: center;
  ${borderRadiuses.MAIN};
  max-height: 75vh;
  min-height: 20vh;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;
