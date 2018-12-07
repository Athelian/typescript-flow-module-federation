// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets, borderRadiuses } from 'styles/common';

export const InlineTimeLineInputWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  width: 200px;
  align-items: center;
`;

export const DelayStyle = (delayAmount: number): string => css`
  color: ${delayAmount > 0 ? colors.RED : colors.TEAL};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: center;
  width: 50px;
`;

export const ApproveButtonStyle = (isApproved: boolean): string => css`
  ${presets.BUTTON};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  ${borderRadiuses.CIRCLE};
  background-color: ${isApproved ? colors.GRAY_LIGHT : colors.BLUE};
  color: ${colors.WHITE};
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    background-color: ${isApproved ? colors.BLUE : colors.GRAY_LIGHT};
  }
`;

export const DateInputWrapperStyle = css`
  &::-webkit-clear-button {
    display: none;
  }
`;
