// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors, presets, borderRadiuses } from 'styles/common';

export const PartnersWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
`;

export const CardStyle: string = css`
  ${layout.HORIZONTAL};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  overflow: hidden;
  border-bottom-right-radius: 0;
  width: 100%;
  width: 200px;
  height: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const PartnerCodeStyle: string = css`
  ${fontSizes.SMALL};
  line-height: 20px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 5px;
  flex: 1;
`;
