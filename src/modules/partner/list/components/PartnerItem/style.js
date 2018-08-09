// @flow
import { css } from 'react-emotion';
import { shadows, colors, borderRadiuses, presets, fontSizesWithHeights } from 'styles/common';

export const PartnerItemStyle = css`
  background-color: #fff;
  ${shadows.WATERFALL};
  ${borderRadiuses.MAIN};
  display: flex;
  flex-direction: column;
  height: min-content;
  padding: 10px;
`;

export const NameStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.LARGE};
  color: ${colors.BLACK};
`;

export const Name2Style = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY_DARK};
`;

export const TypeStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.MEDIUM};
  color: ${colors.BLACK};
  margin-top: 10px;
`;
