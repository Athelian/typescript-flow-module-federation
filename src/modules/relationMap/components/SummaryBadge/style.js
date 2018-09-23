// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const IconStyle = (color: string) => css`
  background: ${colors[color]};
  color: #fff;
  display: flex;
  ${layout.CENTER_CENTER};
  width: 30px;
  height: 30px;
  ${fontSizes.HUGE};
`;

export const SummaryBadgeWrapper = css`
  display: table;

  > :first-child {
    margin: 0;
  }

  > * {
    display: table-cell;
    vertical-align: middle;
  }

  span {
    padding-left: 10px;
  }
`;

export default IconStyle;
