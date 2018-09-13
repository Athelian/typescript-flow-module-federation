// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets } from 'styles/common';

export const TimelineDateWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  align-items: center;
`;

export const PrefixIconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
  width: 18px;
  height: 18px;
`;

export const DateStyle = css`
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  font-weight: bold;
`;

export const DelayStyle = (delayAmount: number) => css`
  color: ${delayAmount > 0 ? colors.RED : colors.TEAL};
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: right;
  width: 30px;
`;

export const ApprovedIconStyle = (approved: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.MAIN};
  color: ${approved ? colors.BLUE : colors.GRAY_SUPER_LIGHT};
  width: 18px;
  height: 18px;
`;
