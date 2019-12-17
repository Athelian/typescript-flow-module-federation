// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const ResetContentWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;
