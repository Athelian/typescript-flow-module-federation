// @flow
import { css } from 'react-emotion';
import { colors, shadows, scrollbars } from 'styles/common';

export const TemplatesListWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`;

export const TemplatesHeaderStyle: string = css`
  position: relative;
  z-index: 1;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  ${shadows.HEADER};
  background-color: ${colors.WHITE};
`;

export const TemplatesBodyStyle: string = css`
  flex: 1;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.MAIN};
`;
