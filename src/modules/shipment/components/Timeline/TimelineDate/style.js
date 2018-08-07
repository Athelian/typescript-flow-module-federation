// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const TimelineDateWrapperStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 3px;
`;

export const DateWrapperStyle = (align: string) => css`
  display: flex;
  align-items: center;
  height: 15px;
  flex: 1;
  justify-content: ${align};
`;

export const IconStyle = (color: string) => css`
  ${fontSizes.SMALL};
  color: ${colors[color]};
  margin: 0 3px;
`;

export const ActualDateStyle = css`
  ${fontSizes.SMALL};
  font-weight: bold;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const EstimatedDateStyle = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  ${presets.ELLIPSIS};
`;

export const DelayStyle = (delay: number) => css`
  ${fontSizes.SMALL};
  font-weight: bold;
  margin: 0 3px;
  color: ${delay > 0 ? colors.RED : colors.TEAL};
  ${presets.ELLIPSIS};
`;
