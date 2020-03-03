// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizesWithHeights, presets, borderRadiuses } from 'styles/common';

export const CardStyle = (isTwoLine: boolean): string => css`
  ${layout.HORIZONTAL};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  overflow: hidden;
  border-bottom-right-radius: 0;
  width: 100%;
  min-width: 40px;
  ${isTwoLine ? `height: 40px;` : `height: 40px;`}
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const PartnerNameStyle: string = css`
  color: ${colors.BLACK};
  font-weight: bold;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  width: 100%;
  padding: 0 10px;
`;

export const PartnerCodeStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 10px;
  width: 100%;
`;
