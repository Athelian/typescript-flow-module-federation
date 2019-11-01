// @flow
import { css } from 'react-emotion';
import {
  layout,
  presets,
  borderRadiuses,
  fontSizes,
  colors,
  shadows,
  transitions,
  fontSizesWithHeights,
} from 'styles/common';

export const ApprovalWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${layout.CENTER};
  grid-gap: 10px;
  width: 100%;
`;

export const ApprovedDateStyle: string = css`
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  width: 70px;
  font-weight: bold;
`;

export const ApproveButtonStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  height: 20px;
`;

export const DisapproveButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  position: relative;
  height: 20px;
  width: 20px;
  &:hover > div,
  :focus > div {
    opacity: 1;
  }
`;

export const HoverDisapproveButtonStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER_CENTER};
  ${borderRadiuses.CIRCLE};
  ${shadows.DROPDOWN};
  ${transitions.MAIN};
  background-color: ${colors.WHITE};
  color: ${colors.RED};
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  cursor: pointer;
  opacity: 0;
`;
