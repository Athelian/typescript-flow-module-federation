// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

export const ApprovalWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  justify-content: left;
  grid-gap: 10px;
  padding: 0 5px;
  width: 100%;
  & > button {
    opacity: 1;
  }
`;

export const ApprovedAtStyle: string = css`
  ${fontSizes.MAIN};
  min-height: 18px;
  max-height: 18px;
  line-height: 18px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: right;
`;

export const UnapproveButtonStyle: string = css`
  position: absolute;
  top: 0;
  right: 5px;
  ${presets.BUTTON};
  opacity: 0;
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  color: ${colors.GRAY_LIGHT};
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  ${shadows.DROPDOWN};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;
