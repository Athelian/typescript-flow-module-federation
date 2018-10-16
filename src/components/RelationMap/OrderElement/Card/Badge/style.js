// @flow
import { css } from 'react-emotion';

import { borderRadiuses, fontSizes, colors } from 'styles/common';

export default function BadgeStyle(color: string) {
  return css`
    ${fontSizes.SMALL};
    height: 12px;
    width: 12px;
    ${borderRadiuses.CIRCLE};
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
    background-color: ${colors[color]};
    color: ${colors.WHITE};
    display: inline-block;
    text-align: center;
  `;
}
