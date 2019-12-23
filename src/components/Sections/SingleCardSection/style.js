// @flow
import { css } from 'react-emotion';
import { borderRadiuses, shadows, colors } from 'styles/common';

export const SingleCardSectionWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  ${shadows.WATERFALL};
  width: 880px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const SingleCardSectionBodyStyle: string = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.MAIN};
  min-height: 20vh;
  padding: 20px;
`;
