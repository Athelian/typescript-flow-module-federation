// @flow
import { css } from 'react-emotion';
import { presets, scrollbars, colors, shadows, borderRadiuses } from 'styles/common';

export const PackagingSectionWrapperStyle: string = css`
  display: flex;
  width: 880px;
  height: 410px;
  ${presets.BOX};
`;

export const PackagingListWrapperStyle: string = css`
  width: 240px;
  background-color: ${colors.WHITE};
  ${shadows.HEADER_RIGHT};
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  overflow: hidden;
`;

export const PackagingListBodyStyle: string = css`
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.SMALL};
  height: 360px;
`;

export const NewPackagingButtonWrapperStyle: string = css`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  ${shadows.HEADER_REVERSE};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;
