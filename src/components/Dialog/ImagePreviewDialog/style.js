// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';

export const DialogStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: min-content;
  height: min-content;
`;

export const ImageStyle: string = css`
  ${borderRadiuses.MAIN};
  max-width: calc(100vw - 200px);
`;

export default DialogStyle;
