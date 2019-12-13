// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const ResetContentWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const ContentWrapperStyle = css`
  height: calc(100vh - 50px);
  padding: 0 0;
  width: 100%;
  overflow-y: hidden;
  z-index: 0;
`;

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;
