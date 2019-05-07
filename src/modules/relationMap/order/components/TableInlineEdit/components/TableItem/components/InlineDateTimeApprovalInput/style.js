// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets, borderRadiuses } from 'styles/common';

export const InlineDateTimeApprovalInputWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  width: 200px;
  align-items: center;
  grid-gap: 10px;
`;

export const ApproveButtonStyle = (isApproved: boolean): string => css`
  ${presets.BUTTON};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  ${borderRadiuses.CIRCLE};
  background-color: ${isApproved ? colors.BLUE : colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    background-color: ${isApproved ? colors.BLUE_DARK : colors.GRAY};
  }
`;

export const DateInputWrapperStyle = css`
  &::-webkit-clear-button {
    display: none;
  }
`;
