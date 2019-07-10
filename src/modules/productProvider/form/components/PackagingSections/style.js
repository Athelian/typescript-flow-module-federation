// @flow
import { css } from 'react-emotion';
import { presets, scrollbars } from 'styles/common';

export const PackagingWrapperStyle: string = css`
  display: flex;
  width: 880px;
  ${presets.BOX};
`;

export const SidebarWrapperStyle: string = css`
  width: 240px;
  overflow-y: overlay;
  ${scrollbars.MAIN};
  ${presets.BOX};
`;

export const ScrollbarWrapperStyle: string = css`
  height: 360px;
  overflow-y: overlay;
  ${scrollbars.SMALL};
`;

export const ButtonWrapperStyle: string = css`
  width: 240px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${presets.BOX};
`;

export const PackageItemWrapperStyle: string = css`
  width: 240px;
  height: 40px;
`;

export default PackagingWrapperStyle;
