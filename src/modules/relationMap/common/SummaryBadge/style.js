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

export const SummaryBadgeLabel = css`
  color: ${colors.GRAY_LIGHT};
  letter-spacing: 2px;
  align-self: center;
  margin-left: 10px;
`;

export const SummaryBadgeWrapper = css`
  padding-left: 10px;
  ${layout.HORIZONTAL};
`;

export default IconStyle;
