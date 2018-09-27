// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets } from 'styles/common';

export const PartnerCardStyle = (size: 'full' | 'half' | 'quarter'): string => css`
  display: grid;
  ${size === 'full' &&
    `
      grid-template-columns: 200px;
      grid-template-rows: 100px 130px;
    `};
  ${size === 'half' &&
    `
      grid-template-columns: 200px;
      grid-template-rows: 30px 80px;
    `};
  ${size === 'quarter' &&
    `
      grid-template-columns: 95px;
      grid-template-rows: 30px 80px;
    `};
`;

export const PartnerCardImageStyle: string = css`
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PartnerNameStyle: string = css`
  color: ${colors.BLACK};
  font-weight: bold;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  width: 100%;
  padding: 0 10px;
`;
