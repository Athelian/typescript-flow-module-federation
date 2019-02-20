// @flow
import { css } from 'react-emotion';
import { shadows, colors, scrollbars } from 'styles/common';

export const FieldDefinitionsWrapperStyle: string = css`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  ${shadows.HEADER_RIGHT};
`;

export const FieldDefinitionsHeaderStyle: string = css`
  position: relative;
  z-index: 2;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  ${shadows.HEADER};
  background-color: ${colors.WHITE};
`;

export const FieldDefinitionsBodyStyle: string = css`
  background-color: ${colors.WHITE};
  flex: 1;
  padding: 50px 0;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.MAIN};
`;
