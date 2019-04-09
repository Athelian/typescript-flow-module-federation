// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes, fontSizesWithHeights } from 'styles/common';

export const LogWrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 20px;
`;

export const TimeStyle = css`
  ${fontSizes.SMALL};
  font-weight: 600;
  letter-spacing: 0.1em;
  color: ${colors.GRAY_DARK};
  width: 80px;
`;

export const LogStyle = css`
  ${fontSizesWithHeights.MAIN};
  font-weight: 600;
  color: ${colors.GRAY_DARK};
  flex: 1;
`;
