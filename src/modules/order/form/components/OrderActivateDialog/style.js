// @flow
import { css } from 'react-emotion';
import { colors, layout } from 'styles/common';

export function SpanStyle(color: string) {
  return css`
    color: ${colors[color]};
  `;
}

export const MessageStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;
