// @flow
import { css } from 'react-emotion';
import { colors, shadows } from 'styles/common';

export const EditTableViewWrapperStyle: string = css`
  position: relative;
  width: 1030px;
  height: 100%;
`;

export const HeaderWrapperStyle: string = css`
  height: 50px;
  width: 100%;
  padding: 0 5px 0 35px;
  position: absolute;
  top: 0;
  left: 0;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  overflow: hidden;
`;

export const SidebarWrapperStyle: string = css`
  width: 30px;
  height: calc(100% - 50px);
  position: absolute;
  top: 50px;
  left: 0;
  padding: 5px 0;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  overflow: hidden;
`;

export const BodyWrapperStyle: string = css`
  width: 100%;
  height: 100%;
  overflow: overlay;
  padding: 55px 5px 5px 35px;
`;

export const ButtonToolbarStyle: string = css`
  display: block;
  width: 100%;
  justify-content: space-around;
`;
