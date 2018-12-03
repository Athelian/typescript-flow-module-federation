// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const ShipmentBadgeContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IconStyle = (color: string, hoverColor: ?string) => css`
  background: ${colors[color]};
  color: ${colors.WHITE};
  display: flex;
  ${layout.CENTER_CENTER};
  width: 30px;
  height: 30px;
  cursor: pointer;
  ${fontSizes.HUGE};
  ${hoverColor &&
    `
    &:hover {
      background: ${colors[hoverColor]};
    }
  `};
`;

export const SummaryBadgeLabel = css`
  color: ${colors.GRAY_LIGHT};
  letter-spacing: 2px;
  align-self: center;
  margin-left: 10px;
  text-transform: uppercase;
`;

export const SummaryBadgeWrapper = css`
  padding-left: 10px;
  ${layout.HORIZONTAL};
`;

export default IconStyle;
