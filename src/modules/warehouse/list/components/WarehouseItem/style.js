import { css } from 'react-emotion';
import { layout, presets, colors, fontSizesWithHeights } from 'styles/common';

export const WarehouseItemStyle = css`
  ${layout.VERTICAL};
  width: 100%;
  padding: 10px;
`;

export const NameStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.LARGE};
  color: #555;
`;

export const PlaceStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.MEDIUM};
  color: ${colors.BLACK};
  & > svg {
    margin: 0 5px 0 0;
  }
`;

export const IconStyle = css`
  color: ${colors.GRAY_DARK};
`;
