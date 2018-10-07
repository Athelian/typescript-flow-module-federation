// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets } from 'styles/common';

export const TimelineDateWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 1px;
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

export const DateStyle = (shownDate: boolean) => css`
  color: ${shownDate ? colors.BLACK : colors.GRAY_LIGHT};
  ${fontSizes.LITTLE};
  ${presets.ELLIPSIS};
  font-weight: bold;
  height: 18px;
  line-height: 18px;
`;

export const DelayStyle = (delayAmount: number) => css`
  color: ${delayAmount > 0 ? colors.RED : colors.TEAL};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: center;
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
