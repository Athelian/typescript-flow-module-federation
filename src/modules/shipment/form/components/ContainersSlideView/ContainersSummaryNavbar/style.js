// @flow
import { css } from 'react-emotion';
import { colors, shadows } from 'styles/common';

export const ContainersSummaryNavbarWrapperStyle: string = css`
  position: relative;
  display: flex;
  background-color: ${colors.WHITE};
  ${shadows.HEADER};
  height: 100px;
  width: 100%;
  z-index: 1;
`;

export const LeftAreaWrapperStyle: string = css`
  position: relative;
  display: flex;
  ${shadows.HEADER_RIGHT};
  flex: 1;
  background-color: ${colors.WHITE};
  padding: 10px;
`;

export const RightAreaWrapperStyle: string = css`
  ${shadows.HEADER_LEFT};
  flex: 1;
  background-color: ${colors.WHITE};
  padding: 10px;
`;
