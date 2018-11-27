// @flow
import { css } from 'react-emotion';

import { shadows, colors, scrollbars } from 'styles/common';

export const WrapperStyle: string = css`
  height: calc(100vh - 50px);
  ${shadows.FAINT};
`;

export const HeaderStyle: string = css`
  padding-left: 100px;
  padding-right: 20px;
  ${shadows.HEADER};
`;

export const ContainerWrapperStyle: string = css`
  background-color: ${colors.WHITE};
  height: 100%;
  padding-top: 50px;
  padding-bottom: 100px;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.MAIN};
`;
