// @flow
import { css } from 'react-emotion';
import {
  colors,
  layout,
  borderRadiuses,
  fontSizesWithHeights,
  fontSizes,
  presets,
} from 'styles/common';

export const StaffCardWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  grid-template-columns: 195px;
  width: 195px;
  height: 247px;
  justify-items: center;
  padding: 10px 0 5px 0;
`;

export const StaffNameStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 0 10px;
  width: 100%;
`;

export const StaffEmailStyle: string = css`
  ${fontSizesWithHeights.MEDIUM};
  ${presets.ELLIPSIS};
  padding: 0 10px;
  width: 100%;
  color: ${colors.GRAY_DARK};
`;

export const StaffRoleStyle: string = css`
  display: flex;
  padding: 0 5px 0 10px;
  width: 100%;
`;

export const StaffRoleIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.GRAY_DARK};
  ${fontSizes.MAIN};
  margin: 0 5px 0 0;
`;

export const StaffTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 175px;
  margin: 0 10px;
  overflow: hidden;
  height: 18px;
`;
