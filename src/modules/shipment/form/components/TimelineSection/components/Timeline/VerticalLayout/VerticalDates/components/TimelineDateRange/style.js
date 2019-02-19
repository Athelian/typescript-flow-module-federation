// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets } from 'styles/common';

export const TimelineDateWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  align-items: center;
`;

export const LabelStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${fontSizes.TINY};
  color: ${colors.GRAY_LIGHT};
  width: 18px;
  height: 18px;
  letter-spacing: 1px;
  white-space: nowrap;
`;

export const DateStyle = (hasDate: boolean, color: string): string => css`
  color: ${hasDate ? colors[color] : colors.GRAY_LIGHT};
  ${presets.ELLIPSIS};
  font-weight: bold;
  ${fontSizes.MAIN};
  width: 105px;
  text-align: left;
`;

export const ApprovedIconStyle = (approved: boolean): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.MAIN};
  width: 18px;
  height: 18px;
  color: ${approved ? colors.BLUE : colors.GRAY_SUPER_LIGHT};
`;
