// @flow
import { css } from 'react-emotion';

export const ParentContainerStyle = css`
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const ContainerStyle: string = css`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

export default ParentContainerStyle;
