// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets } from 'styles/common';

export const TimelineDateWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  align-items: center;
`;

export const PrefixIconStyle = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
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
`;

export const ApprovedIconStyle = (approved: boolean) => css`
  ${fontSizes.MAIN};
  color: ${approved ? colors.BLUE : colors.GRAY_SUPER_LIGHT};
`;
