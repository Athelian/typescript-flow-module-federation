// @flow
import { css } from 'react-emotion';

import { shadows, colors } from 'styles/common';

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
  overflow-y: auto;
`;

export const ContainerStyle: string = css`
  width: 840px;
  margin: 0 100px;
`;

export const AddButtonWrapperStyle: string = css`
  display: flex;
  justify-content: flex-end;
`;
