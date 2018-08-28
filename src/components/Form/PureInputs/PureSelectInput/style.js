// @flow
import { css } from 'react-emotion';

export const ResetNativeStyle = css`
  position: relative;
`;

export const ResetOptionWrapperStyle = css`
  list-style-type: none;
  position: absolute;
  margin: 0;
  padding: 0;
  margin-top: 5px;
  overflow: hidden;
  z-index: 1;
  min-width: min-content;
`;

export const ResetOptionStyle = css`
  min-width: min-content;
  width: 100%;
  white-space: nowrap;
`;
