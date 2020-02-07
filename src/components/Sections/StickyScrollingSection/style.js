// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors } from 'styles/common';

export const StickyScrollingSectionWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  width: 880px;
`;

export const StickyStyle: string = css`
  position: sticky;
  top: 0px;
  width: 100%;
  z-index: 2;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const StickySectionBodyStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_VERY_LIGHT};
`;
